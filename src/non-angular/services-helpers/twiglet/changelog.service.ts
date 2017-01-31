import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { ChangeLog } from '../../interfaces/twiglet';
import { apiUrl, twigletsFolder } from '../../config';

/**
 * Contains all the information and modifiers for the nodes on the twiglet.
 *
 * @export
 * @class ChangeLogService
 */
export class ChangeLogService {

  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ChangeLogService
   */
  private _changelogs: BehaviorSubject<Map<string, List<any>>> =
    new BehaviorSubject(Map<string, any>({
      changelog: List([])
    }));

    constructor(private http: Http) { }
  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf ChangeLogService
   */
  get observable(): Observable<Map<string, List<any>>> {
    return this._changelogs.asObservable();
  }

  getChangelog(id) {
    console.log(id);
    console.log(`${apiUrl}/${twigletsFolder}/${id}`);
    return this.http.get(`${apiUrl}/${twigletsFolder}/${id}/changelog`).map((res: Response) => res.json());
    // .subscribe(response => {
    //   console.log(response);
    //   this._changelogs.next(this._changelogs.getValue().set('changelog', List(response.changelog)))
    // });
  }

  /**
   * Adds a changelog to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ChangeLogService
   */
  addLog(newLog: ChangeLog) {
    this.addLogs([newLog]);
  }

  /**
   * Adds an array of changelogs to the twiglet (used for initial loading)
   *
   * @param {newLogs[]} newLogs an array of logs be to be added.
   *
   * @memberOf ChangeLogService
   */
  addLogs(newLogs: ChangeLog[]) {
    const mutableNodes = this._changelogs.getValue().asMutable();
    const newState = newLogs.reduce((mutable, log) => {
      return mutable.set(log.timestamp, fromJS(log));
    }, mutableNodes).asImmutable();
    this._changelogs.next(newState);
  }
}

export class ChangeLogServiceStub extends ChangeLogService {

  get observable(): Observable<Map<string, List<any>>> {
    return new BehaviorSubject(Map<string, any>(fromJS({
    }))).asObservable();
  }

  addLog(newLog: ChangeLog) { }

  addLogs(newLogs: ChangeLog[]) { }
}
