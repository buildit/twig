import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { merge, pick } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { cleanAttribute, convertMapToArrayForUploading } from './';
import { Config } from '../../config';
import { D3Node, Event, Link, View, ViewNode, ViewUserState } from '../../interfaces';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';

export class EventsService {
  private eventsUrl;
  private sequencesUrl;
  private twiglet;
  private userState: Map<string, any>;
  private playbackInterval;
  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf EventService
   */

  private _events: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
      new BehaviorSubject(OrderedMap<string, Map<string, any>>());

  private _sequences: BehaviorSubject<List<Map<string, any>>> =
      new BehaviorSubject(List<Map<string, any>>([]));

  private nodeLocations: Map<string, any>;

  private fullyLoadedEvents = {};

  constructor(private http: Http,
              private parent: TwigletService,
              private userStateService: UserStateService,
              private toastr: ToastsManager) {

    parent.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      if (twiglet.get('events_url') !== this.eventsUrl) {
        this.sequencesUrl = twiglet.get('sequences_url');
        this.eventsUrl = twiglet.get('events_url');
        this.fullyLoadedEvents = {};
        this.refreshEvents();
        this.refreshSequences();
      }
    });

    this.userStateService.observable.subscribe(userState => {
      this.userState = userState;
    });

    parent.nodeLocations.subscribe(nodeLocations => {
      this.nodeLocations = nodeLocations;
    });
  }

  /**
   * Returns a list of the events
   *
   * @readonly
   * @type {Observable<List<Map<string, any>>>}
   * @memberOf EventService
   */
  get events(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._events.asObservable();
  }

  /**
   * Returns a list of the sequences
   *
   * @readonly
   * @type {Observable<List<Map<string, any>>>}
   * @memberOf EventsService
   */
  get sequences(): Observable<List<Map<string, any>>> {
    return this._sequences.asObservable();
  }

  /**
   * Returns an event as an observable, checks for the cache first.
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberOf eventsService
   */
  getEvent(id: string): Observable<any> {
    if (this.fullyLoadedEvents[id]) {
      return Observable.of(this.fullyLoadedEvents[id]);
    }
    return this.http.get(`${this.eventsUrl}/${id}`).map(r => r.json())
    .flatMap(event => {
      this.fullyLoadedEvents[event.id] = event;
      return Observable.of(this.fullyLoadedEvents[id]);
    });
  }

  stepBack() {
    const checkedEvents = this._events.getValue().filter(event => event.get('checked')).valueSeq().toList();
    const index = checkedEvents.findIndex(event => event.get('id') === this.userState.get('currentEvent'));
    return checkedEvents.get(index - 1);
  }

  stepForward() {
    const checkedEvents = this._events.getValue().filter(event => event.get('checked')).valueSeq().toList();
    const index = checkedEvents.findIndex(event => event.get('id') === this.userState.get('currentEvent'));
    return checkedEvents.get(index + 1) ? checkedEvents.get(index + 1) : checkedEvents.get(0);
  }

  setAllCheckedTo(checked: boolean) {
    const matcher = this.userState.get('eventFilterText');
    this._events.next(this._events.getValue().map(e => {
      if (!matcher || e.get('name').includes(matcher)) {
        return e.set('checked', checked);
      }
      return e;
    }) as Map<string, any>);
  }

  /**
   * Caches events locally so they can be played without interupption
   *
   * @param {string[]} ids
   * @returns {Observable<any>}
   *
   * @memberOf eventsService
   */
  cacheEvents(): Observable<any> {
    this.userStateService.startSpinner();
    return Observable.forkJoin(this.eventSequence.reduce((array, id) => {
      array.push(this.getEvent(id));
      return array;
    }, [])).flatMap(() => {
      this.userStateService.stopSpinner();
      return Observable.of({});
    });
  }

  /**
   * Grabs the list of events from the server.
   *
   *
   * @memberOf EventService
   */
  refreshEvents() {
    if (this.eventsUrl) {
      this.http.get(this.eventsUrl).map((res: Response) => res.json())
      .subscribe((response: Event[]) => {
        let newEvents: OrderedMap<string, Map<string, any>> = OrderedMap<string, Map<string, any>>().asMutable();
        response.forEach((event) => {
          newEvents = newEvents.set(event.id, fromJS(event));
        });
        this._events.next(newEvents.mergeDeep(this.getSequencesEventIsMemberOf(newEvents)));
      });
    }
  }

  /**
   * Grabs the list of sequences from the server.
   *
   *
   * @memberOf EventsService
   */
  refreshSequences() {
    if (this.sequencesUrl) {
      this.http.get(this.sequencesUrl).map((res: Response) => res.json())
      .subscribe(response => {
        this._sequences.next(fromJS(response));
        this._events.next(this._events.getValue().mergeDeep(this.getSequencesEventIsMemberOf()));
      });
    }
  }

  /**
   * Loads a list of sequences into memory (makes the checked);
   *
   * @param {any} sequenceId
   *
   * @memberOf EventsService
   */
  loadSequence(sequenceId) {
    this.http.get(`${this.sequencesUrl}/${sequenceId}`).map(r => r.json())
    .subscribe(({ events }) => {
      let mutableEvents = this._events.getValue().asMutable();
      mutableEvents = mutableEvents.map((event, key) => event.delete('checked')) as OrderedMap<string, Map<string, any>>;
      events.forEach(id => {
        mutableEvents = mutableEvents.setIn([id, 'checked'], true);
      });
      this._events.next(mutableEvents.asImmutable());
    });
  }

  /**
   * Returns a sequence as an observable of timed events.
   *
   * @returns {Observable<any>}
   *
   * @memberOf EventsService
   */
  getSequenceAsTimedEvents(): Observable<any> {
    this.userStateService.setPlayingBack(true);
    if (this.eventSequence.length) {
      const [ first ] = this.eventSequence;
      return this.cacheEvents()
      .flatMap(() => Observable.from(this.eventSequence))
      .concatMap(id => this.getEvent(id).delay(id === first ? 0 : this.userState.get('playbackInterval')));
    }
    return Observable.throw('no events checked');
  }

  /**
   * Updates the event sequence, adding or subtracting the id from the sequence.
   *
   * @param {number} index the index of the event in the array.
   * @param {boolean} add true if this should be added
   *
   * @memberOf eventsService
   */
  updateEventSequence(id: string, add: boolean) {
    if (add) {
      this._events.next(this._events.getValue().setIn([id, 'checked'], true));
    } else {
      this._events.next(this._events.getValue().deleteIn([id, 'checked']));
    }
  }

  /**
   * Cleans the nodes so only the stuff needed for events is passed in.
   *
   * @param {D3Node} d3Node
   * @returns {D3Node}
   *
   * @memberOf EventsService
   */
  sanitizeNodesForEvents(d3Node: D3Node): D3Node {
    let nodeLocation = {};
    if (this.nodeLocations.get(d3Node.id)) {
      nodeLocation = this.nodeLocations.get(d3Node.id).toJS();
    }
    const sanitizedNode = pick([
      'id',
      'location',
      'name',
      'type',
      'x',
      'y',
      '_color',
      '_size'
    ], merge(d3Node, nodeLocation)) as any;
    sanitizedNode.attrs = d3Node.attrs.map(cleanAttribute);
    if (!sanitizedNode.location) {
      sanitizedNode.location = '';
    }
    return sanitizedNode;
  }

  /**
   * Cleans the links so only the stuff needed for events is passed in.
   *
   * @param {Link} link
   * @returns {Link}
   *
   * @memberOf EventsService
   */
  sanitizeLinksForEvents(link: Link): Link {
    const sanitizedLink = pick([
      'association',
      'attrs',
      'id',
      'source',
      'target'
    ], link) as any;
    return sanitizedLink;
  }

  /**
   *
   * Creates a new event on the twiglet.
   *
   * @param {object} event
   *
   * @memberOf EventsService
   */
  createEvent(event) {
    const twigletName = this.twiglet.get('name');
    const eventToSend = {
      description: event.description,
      name: event.name,
    };
    return this.http.post(this.eventsUrl, eventToSend, authSetDataOptions)
    .flatMap(response => {
      this.refreshEvents();
      return Observable.of(response);
    });
  }

  deleteEvent(id) {
    const twigletName = this.twiglet.get('name');
    return this.http.delete(`${this.eventsUrl}/${id}`, authSetDataOptions)
    .map((res: Response) => res.json());
  }

  createSequence({name, description}: { name: string, description: string }) {
    const twigletName = this.twiglet.get('name');
    const sequenceToSend = {
      description: description,
      events: this.eventSequence,
      name: name,
    };
    return this.http.post(this.sequencesUrl, sequenceToSend, authSetDataOptions)
    .flatMap(response => {
      this.refreshSequences();
      return Observable.of(response);
    });
  }

  updateSequence(sequence) {
    const twigletName = this.twiglet.get('name');
    const sequenceToSend = {
      description: sequence.description,
      events: this.eventSequence,
      name: sequence.name
    };
    return this.http.put(`${this.sequencesUrl}/${sequence.id}`, sequenceToSend, authSetDataOptions)
     .flatMap(response => {
      this.refreshSequences();
      return Observable.of(response);
    });
  }

  deleteSequence(id) {
    const twigletName = this.twiglet.get('name');
    return this.http.delete(`${this.sequencesUrl}/${id}`, authSetDataOptions)
    .map((res: Response) => res.json());
  }

  private getSequencesEventIsMemberOf(eventsMap?: OrderedMap<string, Map<string, any>>): OrderedMap<string, Map<string, any>> {
    eventsMap = eventsMap || this._events.getValue();
    if (eventsMap && this._sequences.getValue()) {
      return eventsMap.map(event => {
        if (event) {
          const list = this._sequences.getValue()
              .filter(seq => seq.get('events'))
              .filter(seq => (<List<string>>seq.get('events')).includes(event.get('id')))
              .map(seq => seq.get('name'));
          if (list.size) {
            return Map({ memberOf: list });
          }
        }
        return undefined;
      }).filter(value => value !== undefined) as Map<string, Map<string, any>>;
    }
    return fromJS({});
  }

  /**
   * Translates the current set of events into a sequence based on what is checked.
   *
   * @readonly
   * @private
   * @type {string[]}
   * @memberOf eventsService
   */
  private get eventSequence(): string[] {
    return this._events.getValue()
      .filter(event => event.get('checked'))
      .reduce((array, event: Map<string, string>) => {
      array.push(event.get('id'));
      return array;
    }, []);
  }
}
