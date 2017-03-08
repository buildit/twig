import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserStateService } from './../userState/index';
import { OverwriteDialogComponent } from './../../../app/overwrite-dialog/overwrite-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromJS, Map, OrderedMap, List } from 'immutable';

import { View } from '../../interfaces';
import { Config } from '../../config';
import { handleError, authSetDataOptions } from '../httpHelpers';

export interface Parent {
  observable: Observable<Map<string, any>>;
}

export class ViewService {
  private userState;
  private viewsUrl;
  twigletName = null;
  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf ViewService
   */

  private _views: BehaviorSubject<List<Map<string, any>>> =
      new BehaviorSubject(List<Map<string, any>>([Map<string, any>({})]));

  // private _viewBackup: OrderedMap<string, Map<string, any>> = null;

  private _events: BehaviorSubject<string> =
      new BehaviorSubject('initial');

  constructor(private http: Http, parent: Parent, private userStateService: UserStateService, private toastr: ToastsManager) {
    userStateService.observable.subscribe(response => {
      this.userState = response;
    });
    parent.observable.subscribe(p => {
      this.twigletName = p.get('name');
      if (p.get('views_url') !== this.viewsUrl) {
        this.viewsUrl = p.get('views_url');
        this.refreshViews();
      }
    });
  }

  get observable(): Observable<List<Map<string, any>>> {
    return this._views.asObservable();
  }

  refreshViews() {
    if (this.viewsUrl) {
      this.http.get(this.viewsUrl).map((res: Response) => res.json()).subscribe(response => {
        this._views.next(fromJS(response));
      });
    }
  }

  loadView(viewsUrl, name) {
    if (name) {
      return this.http.get(viewsUrl).map((res: Response) => res.json()).flatMap(viewsArray => {
        const viewUrl = viewsArray.filter(view => view.name === name)[0].url;
        this.userStateService.stopSpinner();
        return this.http.get(viewUrl).map((res: Response) => res.json())
        .flatMap(response => this.userStateService.loadUserState(response.userState))
        .catch(handleError.bind(this));
      });
    }
    return Observable.of(undefined);
  }

  prepareViewForSending() {
    const unneededKeys = [
      'activeModel',
      'activeTwiglet',
      'copiedNodeId',
      'currentViewName',
      'editTwigletModel',
      'formValid',
      'isEditing',
      'mode',
      'nodeTypeToBeAdded',
      'textToFilterOn',
      'user',
    ];
    const currentState = this.userState.toJS();
    unneededKeys.forEach(key => {
      delete currentState[key];
    });
    return currentState;
  }

  createView(name, description?) {
    const viewToSend: View = {
      description,
      name,
      userState: this.prepareViewForSending(),
    };
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}/${this.twigletName}/views`, viewToSend, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(newView => {
      this.refreshViews();
      this.toastr.success(`View ${name} created successfully`);
      return Observable.of(newView);
    })
    .catch((errorResponse) => {
      handleError.bind(this)(errorResponse);
      return Observable.throw(errorResponse);
    });
  }

  saveView(viewUrl, name, description) {
    const viewToSend: View = {
      description,
      name,
      userState: this.prepareViewForSending(),
    };
    return this.http.put(viewUrl, viewToSend, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(newView => {
      this.refreshViews();
      this.toastr.success(`View ${name} updated successfully`);
      return Observable.of(newView);
    })
    .catch((errorResponse) => {
      handleError.bind(this)(errorResponse);
      return Observable.throw(errorResponse);
    });
  }

  deleteView(viewUrl) {
    return this.http.delete(viewUrl, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(response => {
      this.refreshViews();
      this.toastr.success(`View deleted`);
      return Observable.of(response);
    })
    .catch((errorResponse) => {
      handleError.bind(this)(errorResponse);
      return Observable.throw(errorResponse);
    });
  }
}

