import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap, List } from 'immutable';
import { Model } from '../../interfaces';
import { ModelEntity } from './../../interfaces/model/index';
import { apiUrl, modelsFolder, twigletsFolder } from '../../config';
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
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ModelService
   */
  private _model: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(Map<string, any>(fromJS({ _rev: null, nodes: {}, entities: {} })));

  private _modelBackup: OrderedMap<string, Map<string, any>> = null;

  private _entityNameHistory;

  private _events: BehaviorSubject<string> =
    new BehaviorSubject('initial');

  constructor(private http: Http, private router: Router, private twiglet: TwigletService, private userState: UserStateService) {
  }

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

  get events(): Observable<string> {
    return this._events.asObservable();
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ModelService
   */
  setModel(newModel: Model) {
    this._model.next(this._model.getValue().set('_rev', fromJS(newModel._rev)));
    this._model.next(this._model.getValue().set('entities', fromJS(newModel.entities)));
  }

  createBackup() {
    this._modelBackup = this._model.getValue();
    this._entityNameHistory = {};
  }

  restoreBackup() {
    if (this._modelBackup) {
      this._model.next(this._modelBackup);
      this._modelBackup = null;
      return true;
    }
    return false;
  }

  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set('_rev', null);
    mutableModel.set('nodes', fromJS({}));
    mutableModel.set('entities', fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }

  updateEntityAttributes(type: number, attributes: Attribute[]) {
    this._model.next(this._model.getValue().setIn(['entities', type, 'attributes'], fromJS(attributes)));
  }

  updateEntities(entities: ModelEntity[]) {
    const oldEntities = this._model.getValue().get('entities').valueSeq();
    this._model.next(this._model.getValue().set('entities', OrderedMap(entities.reduce((object, entity, index) => {
      if (oldEntities.get(index)) {
        this.twiglet.updateNodeTypes(oldEntities.get(index).get('type'), entity.type);
      }
      object[entity.type] = Map(entity);
      return object;
    }, {}))));
  }

  saveChanges(twigletName) {
    const model = this._model.getValue();
    const modelToSend = {
      _rev: model.get('_rev'),
      entities: model.get('entities')
    };
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(`${apiUrl}/${twigletsFolder}/${twigletName}/model`, modelToSend, options)
      .map((res: Response) => res.json())
      .flatMap(newModel => {
        this.router.navigate(['twiglet', twigletName]);
        return Observable.of(newModel);
      });
  }
}
