import { Model } from './../../interfaces/model';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, List } from 'immutable';
import { clone, merge } from 'ramda';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { UserStateService } from '../userState';
import { apiUrl, modelsFolder, twigletsFolder } from '../../config';
import { handleError, authSetDataOptions } from '../httpHelpers';

export class ModelsService {

  private _models: BehaviorSubject<List<any>> =
    new BehaviorSubject(List([]));

  private _model: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map<string, any>({
      _id: null,
      _rev: null,
      entities: {}
    }));

  private _modelBackup: Map<string, any> = null;

  constructor(private http: Http, public userState: UserStateService, private toastr: ToastsManager) {
    this.updateListOfModels();
  }

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get models(): Observable<List<any>> {
    return this._models.asObservable();
  }

  updateListOfModels() {
    this.http.get(`${apiUrl}/${modelsFolder}`).map((res: Response) => res.json())
    .subscribe(response => this._models.next(List(response)));
  }

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<Map<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<Map<string, any>> {
    return this._model.asObservable();
  }



  /**
   * Creates a backup of the current twiglet so we can edit without consequence.
   *
   *
   * @memberOf ModelService
   */
  createBackup(): void {
    this._modelBackup = this._model.getValue();
  }

  /**
   * Restores the existing backup if it exists. Returns true if restored.
   *
   *
   * @memberOf ModelService
   */
  restoreBackup(): boolean {
    if (this._modelBackup) {
      this._model.next(this._modelBackup);
      return true;
    }
    return false;
  }

  /**
   * Loads a model from the server
   *
   * @param {any} id
   *
   * @memberOf ModelService
   */
  loadModel(id): void {
    const self = this;
    this.http.get(`${apiUrl}/${twigletsFolder}/${id}`).map((res: Response) => res.json())
      .subscribe(this.processLoadedModel.bind(this), handleError.bind(self));
  }

  /**
   * Processes the returned model from the server.
   *
   * @param {Model} modelFromServer
   *
   * @memberOf ModelService
   */
  processLoadedModel(modelFromServer: Model): void {
    this._model.next(fromJS(modelFromServer));
  }

  updateEntityValue(entity: string, key: string, value: string): void {
    this._model.next(this._model.getValue().setIn(['entities', entity, key], value));
  }

  removeEntity(entity: string): void {
    this._model.next(this._model.getValue().removeIn(['entities', entity]));
  }

  saveChanges(commitMessage: string): Observable<Model> {
    const model = this._model.getValue().toJS();
    return this.http.put(`${apiUrl}/${modelsFolder}/${model._id}`, model, authSetDataOptions)
      .map((res: Response) => res.json())
      .flatMap(newModel => {
        this.processLoadedModel(newModel);
        this._modelBackup = null;
        return Observable.of(newModel);
      });
  }

  addModel(body): Observable<any> {
    return this.http.post(`${apiUrl}/${modelsFolder}`, body, authSetDataOptions)
      .map((res: Response) => res.json());
  }

  removeModel(_id: string): Observable<any> {
    return this.http.delete(`${apiUrl}/${modelsFolder}/${_id}`, authSetDataOptions)
      .map((res: Response) => res.json());
  }
}
