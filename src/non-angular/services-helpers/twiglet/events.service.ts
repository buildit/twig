import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { merge, pick } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { cleanAttribute } from './helpers';
import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { D3Node, Event, Link, Sequence, View, ViewNode, ViewUserState } from '../../interfaces';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { UserStateService } from './../userState/index';
import TWIGLET from './constants';
import EVENT from './constants/event';
import USERSTATE from '../userState/constants';
import SEQUENCE from './constants/sequence';

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

  private _sequenceId: BehaviorSubject<string> = new BehaviorSubject(null);

  private nodeLocations: { [key: string]: ViewNode};

  private _eventsBackup: OrderedMap<string, Map<string, any>> = null;

  private fullyLoadedEvents = {};

  constructor(private http: Http,
              private twigletObservable: Observable<Map<string, any>>,
              private nodeLocationObservable: Observable<{ [key: string]: ViewNode}>,
              private userStateService: UserStateService,
              private toastr: ToastsManager) {

                twigletObservable.subscribe(t => {
      this.twiglet = t;
      if (t.get(TWIGLET.EVENTS_URL) !== this.eventsUrl) {
        this.sequencesUrl = t.get(TWIGLET.SEQUENCES_URL);
        this.eventsUrl = t.get(TWIGLET.EVENTS_URL);
        this.fullyLoadedEvents = {};
        this.refreshEvents();
        this.refreshSequences();
      }
    });

    this.userStateService.observable.subscribe(userState => {
      this.userState = userState;
    });

    nodeLocationObservable.subscribe(nodeLocations => {
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

  get sequenceId() {
    return this._sequenceId.asObservable();
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

  createBackup() {
    this._eventsBackup = this._events.getValue();
  }

  restoreBackup() {
    if (this._eventsBackup) {
      this._events.next(this._eventsBackup);
    }
  }

  stepBack() {
    const checkedEvents = this._events.getValue().filter(event => event.get(EVENT.CHECKED)).valueSeq().toList();
    const index = checkedEvents.findIndex(event => event.get(EVENT.ID) === this.userState.get(USERSTATE.CURRENT_EVENT));
    return checkedEvents.get(index - 1);
  }

  stepForward() {
    const checkedEvents = this._events.getValue().filter(event => event.get(EVENT.CHECKED)).valueSeq().toList();
    const index = checkedEvents.findIndex(event => event.get(EVENT.ID) === this.userState.get(USERSTATE.CURRENT_EVENT));
    return checkedEvents.get(index + 1) ? checkedEvents.get(index + 1) : checkedEvents.get(0);
  }

  setAllCheckedTo(checked: boolean) {
    const matcher = this.userState.get(USERSTATE.EVENT_FILTER_TEXT);
    this._events.next(this._events.getValue().map(e => {
      if (!matcher || e.get(EVENT.NAME).includes(matcher)) {
        return e.set(EVENT.CHECKED, checked);
      }
      return e;
    }) as Map<string, any>);
  }

  checkEvent(id: string, checked: boolean) {
    this._events.next(this._events.getValue().map(e => {
      if (e.get('id') === id) {
        return e.set(EVENT.CHECKED, checked);
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
    return this.http.get(`${this.sequencesUrl}/${this._sequenceId.getValue()}/details`).map(r => r.json())
    .flatMap(({ events }) => {
      events.forEach(event => {
        this.fullyLoadedEvents[event.id] = event;
      });
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
  loadSequence(sequenceId: string) {
    if (sequenceId !== this._sequenceId.getValue()) {
      this.userStateService.startSpinner();
      return this.http.get(`${this.sequencesUrl}/${sequenceId}`).map(r => r.json())
      .flatMap(this.handleSequenceResponse.bind(this));
    }
    return Observable.of({});
  }

  deselectSequence() {
    this.setAllCheckedTo(false);
    this._sequenceId.next(null);
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
      .concatMap(id => this.getEvent(id).delay(id === first ? 0 : this.userState.get(USERSTATE.PLAYBACK_INTERVAL)));
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
      this._events.next(this._events.getValue().setIn([id, EVENT.CHECKED], true));
    } else {
      this._events.next(this._events.getValue().deleteIn([id, EVENT.CHECKED]));
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
    if (this.nodeLocations[d3Node.id]) {
      nodeLocation = this.nodeLocations[d3Node.id];
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
      'target',
      '_color',
      '_size'
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
    const twigletName = this.twiglet.get(TWIGLET.NAME);
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
    const twigletName = this.twiglet.get(TWIGLET.NAME);
    return this.http.delete(`${this.eventsUrl}/${id}`, authSetDataOptions)
    .map((res: Response) => res.json());
  }

  createSequence({name, description}: { name: string, description: string }) {
    const twigletName = this.twiglet.get(TWIGLET.NAME);
    const sequenceToSend = {
      description: description,
      events: this.eventSequence,
      name: name,
    };
    return this.http.post(this.sequencesUrl, sequenceToSend, authSetDataOptions)
    .map(response => response.json())
    .flatMap((response: Sequence) => {
      this.refreshSequences();
      return Observable.of(response);
    })
    .flatMap(this.handleSequenceResponse.bind(this));
  }

  updateSequence(sequence) {
    const twigletName = this.twiglet.get(TWIGLET.NAME);
    const sequenceToSend = {
      description: sequence.description,
      events: this.eventSequence,
      name: sequence.name
    };
    return this.http.put(`${this.sequencesUrl}/${sequence.id}`, sequenceToSend, authSetDataOptions)
    .map(response => response.json())
    .flatMap(this.handleSequenceResponse.bind(this));
  }

  deleteSequence(id) {
    const twigletName = this.twiglet.get(TWIGLET.NAME);
    return this.http.delete(`${this.sequencesUrl}/${id}`, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(response => {
      if (id === this.sequenceId) {
        this.deselectSequence();
      }
      return Observable.of(response);
    });
  }

  private handleSequenceResponse(sequence: Sequence) {
    this._sequenceId.next(sequence.id);
    let mutableEvents = this._events.getValue().asMutable();
    mutableEvents = mutableEvents.map((event, key) => event.delete(EVENT.CHECKED)) as OrderedMap<string, Map<string, any>>;
    sequence.events.forEach(eId => {
      mutableEvents = mutableEvents.setIn([eId, EVENT.CHECKED], true);
    });
    this._events.next(mutableEvents.asImmutable());
    this.userStateService.stopSpinner();
    return Observable.of(sequence.events);
  }

  private getSequencesEventIsMemberOf(eventsMap?: OrderedMap<string, Map<string, any>>): OrderedMap<string, Map<string, any>> {
    eventsMap = eventsMap || this._events.getValue();
    if (eventsMap && this._sequences.getValue()) {
      return eventsMap.map(event => {
        if (event) {
          const list = this._sequences.getValue()
              .filter(seq => seq.get(SEQUENCE.EVENTS))
              .filter(seq => (<List<string>>seq.get(SEQUENCE.EVENTS)).includes(event.get(EVENT.ID)))
              .map(seq => seq.get(SEQUENCE.NAME));
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
      .filter(event => event.get(EVENT.CHECKED))
      .reduce((array, event: Map<string, string>) => {
      array.push(event.get(EVENT.ID));
      return array;
    }, []);
  }
}
