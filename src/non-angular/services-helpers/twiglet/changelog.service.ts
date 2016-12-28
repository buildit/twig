import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { ChangeLog } from '../../interfaces/twiglet';

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
  private _changelogs: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(OrderedMap<string, Map<string, any>>({}));

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf ChangeLogService
   */
  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._changelogs.asObservable();
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
  addLogs(newNodes: ChangeLog[]) {
    const mutableNodes = this._changelogs.getValue().asMutable();
    const newState = newNodes.reduce((mutable, log) => {
      return mutable.set(log.timestamp, fromJS(log));
    }, mutableNodes).asImmutable();
    this._changelogs.next(newState);
  }
}

/**
 * For testing purposes only. Don't use in production. Stubs out the service.
 *
 * @export
 * @class ChangeLogServicetub
 * @extends {ChangeLogService}
 */
export class ChangeLogServiceStub extends ChangeLogService {

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return new BehaviorSubject(OrderedMap<string, Map<string, any>>(fromJS({
    }))).asObservable();
  }

  addLog(newLog: ChangeLog) { }

  addLogs(newNodes: ChangeLog[]) { }
 }
