import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { ChangeLog } from '../../interfaces/twiglet';
import { apiUrl, twigletsFolder } from '../../config';

export interface Parent {
  observable: Observable<Map<string, any>>;
}

/**
 * Contains all the information and modifiers for the nodes on the twiglet.
 *
 * @export
 * @class ChangeLogService
 */
export class ChangeLogService {

  private changelogUrl;
  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ChangeLogService
   */
  private _changelogs: BehaviorSubject<List<Map<string, any>>> =
    new BehaviorSubject(List<Map<string, any>>([Map<string, any>({})]));

    constructor(private http: Http, parent: Parent) {
      parent.observable.subscribe(p => {
        if (p.get('changelogUrl') !== this.changelogUrl) {
          this.changelogUrl = p.get('changelogUrl');
          this.refreshChangelog();
        }
      });
    }
  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf ChangeLogService
   */
  get observable(): Observable<List<Map<string, any>>> {
    return this._changelogs.asObservable();
  }

  refreshChangelog() {
    if (this.changelogUrl) {
      this.http.get(this.changelogUrl).map((res: Response) => res.json()).subscribe(response => {
        console.log('response', response);
        this._changelogs.next(fromJS(response.changelog));
      });
    }
  }
}
