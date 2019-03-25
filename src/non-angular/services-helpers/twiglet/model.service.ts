
import {of as observableOf,  BehaviorSubject ,  Observable } from 'rxjs';

import {mergeMap, map} from 'rxjs/operators';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { equals } from 'ramda';

import { Attribute, Model, ModelEntity } from '../../interfaces';
import { Config } from '../../config';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';
import ENTITY from '../models/constants/entity';
import MODEL from '../models/constants';

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

  private _dirtyEntities: OrderedMap<string, any> = null;

  private _modelBackup: OrderedMap<string, any> = null;

  private _modelNamesHistory: List<Map<string, any>> = null;

  private _isDirty: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

  get dirty(): Observable<boolean> {
    return this._isDirty.asObservable();
  }

  forceClean() {
    this._isDirty.next(false);
  }

  /**
   * Sets the _rev and entities of the model.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf ModelService
   */
  setModel(newModel: Model) {
    const sortedEntities = (<Map<string, any>>fromJS(newModel.entities)).sortBy(entity => entity.get(ENTITY.TYPE));
    this._model.next(this._model.getValue()
                      .set(MODEL._REV, newModel._rev as any)
                      .set(MODEL.URL, newModel.url)
                      .set(MODEL.ENTITIES, sortedEntities));
  }

  /**
   * Creates a backup of the model.
   *
   *
   * @memberOf ModelService
   */
  createBackup() {
    this.forceClean();
    this._modelBackup = this._model.getValue();
    this._modelNamesHistory = this._model.getValue().get(MODEL.ENTITIES).toList().map(entity =>
      Map({ originalType: entity.get(ENTITY.TYPE) })
    );
    this._dirtyEntities = this._modelBackup.get(MODEL.ENTITIES);
  }

  /**
   * Restores a backup of the model
   *
   * @returns true if restored, false if no back up.
   *
   * @memberOf ModelService
   */
  restoreBackup() {
    this.forceClean();
    if (this._modelBackup) {
      this._model.next(this._modelBackup);
      this._modelNamesHistory = null;
      this._dirtyEntities = null;
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
    mutableModel.set(MODEL._REV, null);
    mutableModel.set(MODEL.ENTITIES, fromJS({}));
    this._model.next(mutableModel.asImmutable());
  }

  /**
   * Updates the attributes of an entity via index.
   *
   * @param {string} type
   * @param {Attribute[]} attributes
   *
   * @memberOf ModelService
   */
  updateEntityAttributes(type: string, attributes: Attribute[]) {
    this._dirtyEntities = this._dirtyEntities.setIn([type, ENTITY.ATTRIBUTES], fromJS(attributes));
    if (!equals(this._dirtyEntities.toJS(), this._modelBackup.get(MODEL.ENTITIES).toJS())) {
      // line below carries over attributes from node editor when editing twiglets
      this._model.next(this._model.getValue().setIn([MODEL.ENTITIES, type, ENTITY.ATTRIBUTES], fromJS(attributes)));
      this._isDirty.next(true);
    } else {
      this.forceClean();
    }
  }

  /**
   * Prepends the model names history list when a new entity is added so that the entities don't get updated incorrectly.
   *
   * @memberOf ModelService
   */
  prependModelNames() {
    this._modelNamesHistory = this._modelNamesHistory.unshift(Map({ originalType: '' }));
  }

  /**
   * Removes an entity from the model names history list when that entity is removed from the model
   *
   * @param {number} index
   *
   * @memberOf ModelService
   */
  removeFromModelNames(index: number) {
    this._modelNamesHistory = this._modelNamesHistory.delete(index);
  }

  /**
   * Updates the entity and then updates all of the nodes of this type if necessary.
   *
   * @param {ModelEntity[]} entities
   *
   * @memberOf ModelService
   */
  updateEntities(entities: ModelEntity[]) {
    const oldEntities = this._dirtyEntities.valueSeq();
    if (oldEntities.size === entities.length) {
      this._dirtyEntities = OrderedMap(entities.reduce((object, entity, index) => {
        this._modelNamesHistory = this._modelNamesHistory.setIn([index, 'currentType'], entity.type);
        object[entity.type] = Map(entity);
        return object;
      }, {}));
    } else {
      this._dirtyEntities = OrderedMap(entities.reduce((object, entity, index) => {
        object[entity.type] = Map(entity);
        return object;
      }, {}));
    }
    if (!equals(this._dirtyEntities.toJS(), this._modelBackup.get(MODEL.ENTITIES).toJS())) {
      this._isDirty.next(true);
    } else {
      this.forceClean();
    }
  }

  /**
   * Saves the changes to the model.
   *
   * @returns
   *
   * @memberOf ModelService
   */
  saveChanges(commitMessage = undefined) {
    const model = this._model.getValue();
    const modelToSend = {
      _rev: model.get(MODEL._REV),
      commitMessage,
      entities: this._dirtyEntities.toJS(),
      nameChanges: this._modelNamesHistory.toJS(),
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(model.get(MODEL.URL), modelToSend, options).pipe(
      map((res: Response) => res.json()),
      mergeMap(newModel => {
        this.forceClean();
        return observableOf(newModel);
      }), );
  }
}
