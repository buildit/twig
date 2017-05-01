import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { pick } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';
import { View, ViewUserState } from '../../interfaces';
import { ViewNode } from './../../interfaces/twiglet/view';

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
      return Observable.of(this.fullyLoadedEvents[id]);
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
    if (this.eventsUrl) {
      this.http.get(this.eventsUrl).map((res: Response) => res.json())
      .subscribe(response => {
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
}
