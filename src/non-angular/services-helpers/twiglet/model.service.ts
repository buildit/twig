import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromJS, Map, OrderedMap, List } from 'immutable';
import { Model } from '../../interfaces';
import { ModelEntity } from './../../interfaces/model/index';
import { Config } from '../../config';
import { UserStateService } from './../userState/index';
import { Attribute } from './../../interfaces/twiglet/attribute';
import { TwigletService } from './index';
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
   * @type {BehaviorSubject<OrderedMap<string, any>>}
   * @memberOf ModelService
   */
  private _model: BehaviorSubject<OrderedMap<string, any>> =
    new BehaviorSubject(OrderedMap<string, any>(fromJS({ _rev: null, url: null, entities: {} })));

  private _modelBackup: OrderedMap<string, any> = null;

  constructor(private http: Http, private router: Router, private twiglet: TwigletService) {
  }

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, any>>}
   * @memberOf ModelService
   */
  get observable(): Observable<OrderedMap<string, any>> {
    return this._model.asObservable();
  }

  /**
   * Sets the _rev and entities of the model.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ModelService
   */
  setModel(newModel: Model) {
    this._model.next(this._model.getValue()
                      .set('_rev', newModel._rev as any)
                      .set('url', newModel.url)
                      .set('entities', fromJS(newModel.entities)));
  }

  /**
   * Creates a backup of the model.
   *
   *
   * @memberOf ModelService
   */
  createBackup() {
    this._modelBackup = this._model.getValue();
  }

  /**
   * Restores a backup of the model
   *
   * @returns true if restored, false if no back up.
   *
   * @memberOf ModelService
   */
  restoreBackup() {
    if (this._modelBackup) {
      this._model.next(this._modelBackup);
      this._modelBackup = null;
      return true;
    }
    return false;
  }

  /**
   * Resets the model back to empty everything.
   *
   *
   * @memberOf ModelService
   */
  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set('_rev', null);
    mutableModel.set('entities', fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }

  /**
   * Updates the attributes of an entity via index.
   *
   * @param {string} id
   * @param {Attribute[]} attributes
   *
   * @memberOf ModelService
   */
  updateEntityAttributes(id: string, attributes: Attribute[]) {
    this._model.next(this._model.getValue().setIn(['entities', id, 'attributes'], fromJS(attributes)));
  }

  /**
   * Updates the entity and then updates all of the nodes of this type if necessary.
   *
   * @param {ModelEntity[]} entities
   *
   * @memberOf ModelService
   */
  updateEntities(entities: ModelEntity[]) {
    const oldEntities = this._model.getValue().get('entities').valueSeq();
    if (oldEntities.toJS().length === entities.length) {
      this._model.next(this._model.getValue().set('entities', OrderedMap(entities.reduce((object, entity, index) => {
        this.twiglet.updateNodeTypes(oldEntities.get(index).get('type'), entity.type);
        object[entity.type] = Map(entity);
        return object;
      }, {}))));
    }
  }

  /**
   * Saves the changes to the model.
   *
   * @returns
   *
   * @memberOf ModelService
   */
  saveChanges(twigletName) {
    const model = this._model.getValue();
    const modelToSend = {
      _rev: model.get('_rev'),
      entities: model.get('entities')
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(model.get('url'), modelToSend, options)
      .map((res: Response) => res.json())
      .flatMap(newModel => {
        this.router.navigate(['twiglet', twigletName]);
        return Observable.of(newModel);
      });
  }
}
