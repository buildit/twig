import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { clone, merge } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Attribute, Model, ModelEntity } from './../../interfaces';
import { authSetDataOptions, handleError } from '../httpHelpers';
import { ChangeLogService } from '../changelog';
import { Config } from '../../config';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { UserStateService } from '../userState';
import MODEL from './constants';
import MODEL_ENTITY from './constants/entity'

export class ModelsService {

  /**
   * Service can be reused for updating without trying to navigate or anything.
   *
   * @type {boolean}
   * @memberOf ModelsService
   */
  isSiteWide: boolean;

  /**
   * The changelog service for the current model.
   *
   * @type {ChangeLogService}
   * @memberOf ModelsService
   */
  public changeLogService: ChangeLogService;
  /**
   * The list of models for dropdowns and such.
   *
   * @private
   * @type {BehaviorSubject<List<any>>}
   * @memberOf ModelsService
   */
  private _models: BehaviorSubject<List<any>> =
    new BehaviorSubject(List([]));

  /**
   * the current loaded Model.
   *
   * @private
   * @type {BehaviorSubject<Map<string, any>>}
   * @memberOf ModelsService
   */
  private _model: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map<string, any>({
      _rev: null,
      changelog_url: null,
      entities: OrderedMap({}),
      name: null,
      url: null,
    }));

  private _isDirty: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _events: BehaviorSubject<string> =
    new BehaviorSubject('initial');

  /**
   * A backup of the current model so changes can be made
   *
   * @private
   * @type {Map<string, any>}
   * @memberOf ModelsService
   */
  private _modelBackup: Map<string, any> = null;

  constructor(private http: Http, private toastr: ToastsManager, private router: Router, public modalService: NgbModal,
    siteWide = true, private userState: UserStateService) {
    this.isSiteWide = siteWide;
    if (this.isSiteWide) {
      this.changeLogService = new ChangeLogService(http, this);
      this.updateListOfModels();
    }
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

  get dirty(): Observable<boolean> {
    return this._isDirty.asObservable();
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

  /**
   * Updates the list of models from the server
   *
   *
   * @memberOf ModelsService
   */
  updateListOfModels() {
    this.http.get(`${Config.apiUrl}/${Config.modelsFolder}`).map((res: Response) => res.json())
    .subscribe(response => this._models.next(fromJS(response).sort((a, b) => a.get(MODEL.NAME).localeCompare(b.get(MODEL.NAME)))));
  }

  /**
   * Sets the name of the model.
   *
   * @param {string} name
   *
   * @memberOf ModelsService
   */
  setName(name: string): void {
    this._model.next(this._model.getValue().set(MODEL.NAME, name));
  }

  /**
   * Creates a backup of the current model so we can edit without consequence.
   *
   *
   * @memberOf ModelService
   */
  createBackup(): void {
    this._isDirty.next(false);
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
      this._isDirty.next(false);
      this._model.next(this._modelBackup);
      this._events.next('restore');
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
  loadModel(name): void {
    if (name !== '_new') {
      this.userState.startSpinner();
      this.http.get(`${Config.apiUrl}/${Config.modelsFolder}/${name}`).map((res: Response) => res.json())
        .subscribe(this.processLoadedModel.bind(this), handleError.bind(this));
    }
  }

  /**
   * Clears the model entirely
   *
   *
   * @memberOf ModelsService
   */
  clearModel() {
    const mutableModel = this._model.getValue().asMutable();
    mutableModel.clear();
    mutableModel.set(MODEL.NAME, null);
    mutableModel.set(MODEL._REV, null);
    mutableModel.set(MODEL.ENTITIES, fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }

  /**
   * Processes the returned model from the server.
   *
   * @param {Model} modelFromServer
   *
   * @memberOf ModelService
   */
  private processLoadedModel(modelFromServer: Model): void {
    const model = Map({
      _rev: modelFromServer._rev,
      changelog_url: modelFromServer.changelog_url,
      entities: Reflect.ownKeys(modelFromServer.entities).sort(sortByType)
        .reduce((om: OrderedMap<string, Map<string, any>>, entityType: string) =>
          om.set(entityType, fromJS(modelFromServer.entities[entityType]) as any), OrderedMap({}).asMutable()).asImmutable(),
      name: modelFromServer.name,
      url: modelFromServer.url,
    });
    this.userState.stopSpinner();
    this._model.next(model);
    this.createBackup();
  }

  /**
   * Returns teh changelog of the model.
   *
   * @param {any} url
   * @returns
   *
   * @memberOf ModelsService
   */
  getChangelog(url) {
    return this.http.get(url).map((res: Response) => res.json());
  }

  /**
   * Updates the entities in the model.
   *
   * @param {ModelEntity[]} entities
   *
   * @memberOf ModelsService
   */
  updateEntities(entities: ModelEntity[]) {
    this._isDirty.next(true);
    this._model.next(this._model.getValue().set(MODEL.ENTITIES, OrderedMap(entities.reduce((object, entity) => {
      object[entity.type] = Map(entity);
      return object;
    }, {}))));
  }

  /**
   * Updates the attributes of a specific entity.
   *
   * @param {string} type
   * @param {Attribute[]} attributes
   *
   * @memberOf ModelsService
   */
  updateEntityAttributes(type: string, attributes: Attribute[]) {
    this._isDirty.next(true);
    this._model.next(this._model.getValue().setIn([MODEL.ENTITIES, type, MODEL_ENTITY.ATTRIBUTES], fromJS(attributes)));
  }

  /**
   * Adds an entity to the model.
   *
   * @param {ModelEntity} entity
   *
   * @memberOf ModelsService
   */
  addEntity(entity: ModelEntity): void {
    this._isDirty.next(true);
    this._model.next(this._model.getValue().setIn([MODEL.ENTITIES, entity.type], fromJS(entity)));
  }

  /**
   * Updates a value inside of a specific entity.
   *
   * @param {string} entity The entity to be edited
   * @param {string} key the key to be changed
   * @param {string} value the new value
   *
   * @memberOf ModelsService
   */
  updateEntityValue(entity: string, key: string, value: string): void {
    this._isDirty.next(true);
    this._model.next(this._model.getValue().setIn([MODEL.ENTITIES, entity, key], value));
  }

  /**
   * Removes an entity from the model
   *
   * @param {string} entity the entity to be removed.
   *
   * @memberOf ModelsService
   */
  removeEntity(entity: string): void {
    this._isDirty.next(true);
    this._model.next(this._model.getValue().removeIn([MODEL.ENTITIES, entity]));
  }

  /**
   * Saves the changes made to the current model.
   *
   * @returns {Observable<Model>}
   *
   * @memberOf ModelsService
   */
  saveChanges(commitMessage: string, _rev?): Observable<Model> {
    const model = this._model.getValue();
    const modelToSend = {
      _rev: _rev || model.get(MODEL._REV),
      commitMessage: commitMessage,
      doReplacement: _rev ? true : false,
      entities: model.get(MODEL.ENTITIES).toJS(),
      name: model.get(MODEL.NAME)
    };
    return this.http.put(this._model.getValue().get(MODEL.URL), modelToSend, authSetDataOptions)
      .map((res: Response) => res.json())
      .flatMap(newModel => {
        this._isDirty.next(false);
        if (this.isSiteWide) {
          this.changeLogService.refreshChangelog();
        }
        this.toastr.success(`${newModel.name} saved`, null);
        return Observable.of(newModel);
      })
      .catch(failResponse => {
        if (failResponse.status === 409) {
          const latestData = JSON.parse(failResponse._body).data;
          const modelRef = this.modalService.open(OverwriteDialogComponent);
          const component = <OverwriteDialogComponent>modelRef.componentInstance;
          component.commit = latestData.latestCommit;
          return component.userResponse.asObservable().flatMap(userResponse => {
            if (userResponse === true) {
              modelRef.close();
              return this.saveChanges(commitMessage, latestData._rev);
            } else if (userResponse === false) {
              modelRef.close();
              return Observable.of(failResponse);
            }
          });
        }
        throw failResponse;
      });
  }

  /**
   *
   *
   * @param {any} body
   * @returns {Observable<any>}
   *
   * @memberOf ModelsService
   */
  addModel(body): Observable<any> {
    return this.http.post(`${Config.apiUrl}/${Config.modelsFolder}`, body, authSetDataOptions)
      .map((res: Response) => res.json());
  }

  /**
   * Removes a model from the server.
   *
   * @param {string} name
   * @returns {Observable<any>}
   *
   * @memberOf ModelsService
   */
  removeModel(name: string): Observable<any> {
    return this.http.delete(`${Config.apiUrl}/${Config.modelsFolder}/${name}`, authSetDataOptions)
      .map((res: Response) => res.json());
  }

}

/**
 * Sorts the entities by type.
 *
 * @param {string} first
 * @param {string} second
 * @returns
 */
function sortByType(first: string, second: string) {
  const firstString = first.toLowerCase();
  const secondString = second.toLowerCase();
  if (firstString < secondString) {
    return -1;
  } else if (firstString > secondString) {
    return 1;
  }
  return 0;
}
