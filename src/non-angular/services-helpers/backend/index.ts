import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, List } from 'immutable';
import { clone, merge } from 'ramda';
import { apiUrl, modelsFolder, twigletsFolder } from '../../config';

export class BackendService {

  private _serverState: BehaviorSubject<Map<string, List<any>>> =
    new BehaviorSubject(Map<string, any>({
      models: List([]),
      twiglets: List([]),
    }));

  constructor(private http: Http) {
    this.updateListOfModels();
    this.updateListOfTwiglets();
  }
  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<Map<string, List<any>>> {
    return this._serverState.asObservable();
  }

  updateListOfModels() {
    this.http.get(`${apiUrl}/${modelsFolder}`).map((res: Response) => res.json())
    .subscribe(response => this._serverState.next(this._serverState.getValue().set('models', List(response))));
  }

  updateListOfTwiglets() {
    this.http.get(`${apiUrl}/${twigletsFolder}`).map((res: Response) => res.json())
    .subscribe(response => this._serverState.next(this._serverState.getValue().set('twiglets', List(response))));
  }
}
