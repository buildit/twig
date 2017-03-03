import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserStateService } from './../userState/index';
import { ViewToSend } from './../../interfaces/twiglet/view';
import { OverwriteDialogComponent } from './../../../app/overwrite-dialog/overwrite-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap, List } from 'immutable';

import { View } from '../../interfaces';
import { apiUrl, twigletsFolder } from '../../config';
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
      if (p.get('viewsUrl') !== this.viewsUrl) {
        this.viewsUrl = p.get('viewsUrl');
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

  loadView(viewUrl) {
    this.http.get(viewUrl).map((res: Response) => res.json()).subscribe(response => {
      this.userStateService.loadUserState(response.userState);
    }, handleError.bind(this));
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
    const viewToSend: ViewToSend = {
      description,
      name,
      userState: this.prepareViewForSending(),
    };
    return this.http.post(`${apiUrl}/${twigletsFolder}/${this.twigletName}/views`, viewToSend, authSetDataOptions)
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
    const viewToSend: ViewToSend = {
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
    return this.http.delete(viewUrl)
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

