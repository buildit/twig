import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { merge, pick } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';
import { D3Node, Link, View, ViewNode, ViewUserState } from '../../interfaces';
import { cleanAttribute, convertMapToArrayForUploading } from './index';

export class EventService {
  private userState;
  private eventsUrl;
  private twiglet;
  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ViewService
   */

  private _events: BehaviorSubject<List<Map<string, any>>> =
      new BehaviorSubject(List<Map<string, any>>([Map<string, any>({})]));

  private fullyLoadedEvents = {};

  constructor(private http: Http,
              private parent: TwigletService,
              private userStateService: UserStateService,
              private toastr: ToastsManager) {
    userStateService.observable.subscribe(response => {
      this.userState = response;
    });

    parent.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      if (twiglet.get('events_url') !== this.eventsUrl) {
        this.eventsUrl = twiglet.get('events_url');
        this.fullyLoadedEvents = {};
        this.refreshEvents();
      }
    });
  }

  /**
   * Returns a list of the views
   *
   * @readonly
   * @type {Observable<List<Map<string, any>>>}
   * @memberOf ViewService
   */
  get observable(): Observable<List<Map<string, any>>> {
    return this._events.asObservable();
  }

  private get eventSequence(): string[] {
    return this._events.getValue()
      .filter(event => event.get('checked'))
      .reduce((array, event: Map<string, string>) => {
      array.push(event.get('id'));
      return array;
    }, []);
  }

  getEvent(id: string): Observable<any> {
    if (this.fullyLoadedEvents[id]) {
      return Observable.of(this.fullyLoadedEvents[id]);
    }
    return this.http.get(`${this.eventsUrl}/${id}`).map(r => r.json())
    .flatMap(event => {
      this.fullyLoadedEvents[event.id] = event;
      return this.fullyLoadedEvents[id];
    });
  }

  cacheEvents(ids: string[]): Observable<any> {
    return Observable.forkJoin(ids.reduce((array, id) => {
      array.push(this.getEvent(id));
      return array;
    }, []));
  }

  /**
   * Grabs the list of views from the server.
   *
   *
   * @memberOf ViewService
   */
  refreshEvents() {
    console.log('here1?');
    if (this.eventsUrl) {
      this.http.get(this.eventsUrl).map((res: Response) => res.json())
      .subscribe(response => {
        console.log('response?', response);
        this._events.next(fromJS(response));
      });
    }
  }

  /**
   * Updates the event sequence, adding or subtracting the id from the sequence.
   *
   * @param {number} index the index of the event in the array.
   * @param {boolean} add true if this should be added
   *
   * @memberOf EventService
   */
  updateEventSequence(index: number, add: boolean) {
    if (add) {
      this._events.next(this._events.getValue().setIn([index, 'checked'], true));
    } else {
      this._events.next(this._events.getValue().deleteIn([index, 'checked']));
    }
  }

  saveSequence(name, description) {
    console.warn('not implemented yet');
  }

  sanitizeNodesForEvents(d3Node: D3Node): D3Node {
    let nodeLocation = {};
    console.log(this.twiglet);
    if (this.twiglet._nodeLocations.getValue().get(d3Node.id)) {
      nodeLocation = this.twiglet._nodeLocations.getValue().get(d3Node.id).toJS();
    }
    const sanitizedNode = pick([
      'id',
      'location',
      'name',
      'type',
      'x',
      'y'
    ], merge(d3Node, nodeLocation)) as any;
    sanitizedNode.attrs = d3Node.attrs.map(cleanAttribute);
    if (!sanitizedNode.location) {
      sanitizedNode.location = '';
    }
    return sanitizedNode;
  }

  sanitizeLinksForEvents(link: Link): Link {
    const sanitizedLink = pick([
      'association',
      'attrs',
      'id',
      'source',
      'target'
    ], merge(link, {})) as any;
    return sanitizedLink;
  }

  /**
   *
   * Creates a new event on the twiglet.
   *
   * @param {objecy} event
   *
   * @memberOf TwigletService
   */
  createEvent(event) {
    // const twiglet = this.twiglet.getValue();
    const twigletName = this.twiglet.get('name');
    const eventToSend = {
      description: event.description,
      links: convertMapToArrayForUploading<Link>(this.twiglet.get('links'))
        .map(this.sanitizeLinksForEvents.bind(this)) as Link[],
      name: event.name,
      nodes: convertMapToArrayForUploading<D3Node>(this.twiglet.get('nodes'))
              .map(this.sanitizeNodesForEvents.bind(this)) as D3Node[],
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}/${twigletName}/events`, eventToSend, options);
  }
}
