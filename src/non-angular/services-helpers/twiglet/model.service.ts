import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { Model } from '../../interfaces';

/**
 * Contains all the information and modifiers for the nodes on the twiglet.
 *
 * @export
 * @class ModelService
 */
export class ModelService {

  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ModelService
   */
  private _model: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(Map<string, any>(fromJS({ nodes: {}, entities: {} })));

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf ModelService
   */
  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._model.asObservable();
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ModelService
   */
  setModel(newModel: Model) {
    this._model.next(this._model.getValue().set('entities', fromJS(newModel.entities)));
  }

  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set('nodes', fromJS({}));
    mutableModel.set('entities', fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }
}
