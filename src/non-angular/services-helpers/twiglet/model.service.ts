import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { Model } from '../../interfaces/twiglet';

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
  addModel(newModel: Model) {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.set('nodes', fromJS(newModel.nodes));
    mutableModel.set('entities', fromJS(newModel.entities));
    this._model.next(mutableModel.asImmutable());
  }
}

export class ModelServiceStub extends ModelService {

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf ModelService
   */
  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return new BehaviorSubject(OrderedMap<string, Map<string, any>>(fromJS({
    }))).asObservable();
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ModelService
   */
  addModel(newModel: Model) { }
}
