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
  addModel(newModel: Model) {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.set('entities', fromJS(newModel.entities));
    this._model.next(mutableModel.asImmutable());
  }

  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set('nodes', fromJS({}));
    mutableModel.set('entities', fromJS({}));
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
      entities: {
        ent1: {
          class: 'bang',
          color: '#bada55',
          image: '!',
          size: 40
        },
        ent2: {
          class: 'at',
          color: '#4286f4',
          image: '@',
          size: 40
        },
        ent3: {
          class: 'hashtag',
          color: '#d142f4',
          image: '#',
          size: 40
        },
        ent4: {
          class: 'hashtag',
          color: '#9542f4',
          image: '$',
          size: 40
        },
        ent5: {
          class: 'hashtag',
          color: '#f4424b',
          image: '%',
          size: 40
        },
      },
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
