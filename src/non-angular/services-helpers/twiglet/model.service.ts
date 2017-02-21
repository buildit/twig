import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { Model } from '../../interfaces';
import { ModelEntity } from './../../interfaces/model/index';
import { apiUrl, modelsFolder, twigletsFolder } from '../../config';

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

  private _events: BehaviorSubject<string> =
    new BehaviorSubject('initial');

  constructor(private http: Http, private router: Router) {
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
    this._model.next(this._model.getValue().set('entities', fromJS(newModel.entities)));
  }

  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set('nodes', fromJS({}));
    mutableModel.set('entities', fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }

  updateEntities(entities: ModelEntity[]) {
    this._model.next(this._model.getValue().set('entities', OrderedMap(entities.reduce((object, entity) => {
      object[entity.type] = Map(entity);
      return object;
    }, {}))));
  }

  saveChanges(twigletName) {
    const model = this._model.getValue();
    const modelToSend = {
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
