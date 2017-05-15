import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { pick } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';
import { View, ViewUserState } from '../../interfaces';
import { ViewNode } from './../../interfaces/twiglet/view';

export class ViewService {
  private userState;
  private viewsUrl;
  private nodeLocations: Map<string, any>;
  private twiglet;
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

  constructor(private http: Http,
              private parent: TwigletService,
              private userStateService: UserStateService,
              private toastr: ToastsManager) {
    userStateService.observable.subscribe(response => {
      this.userState = response;
    });
    parent.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      if (twiglet.get('views_url') !== this.viewsUrl) {
        this.viewsUrl = twiglet.get('views_url');
        this.refreshViews();
      }
    });
    parent.nodeLocations.subscribe(nodeLocations => {
      this.nodeLocations = nodeLocations;
    });
  }

  /**
   * Returns a list of the views
   *
   * @readonly
   * @type {Observable<List<Map<string, any>>>}
   * @memberOf ViewService
   */
  get observable(): Observable<List<Map<string, any>>> {
    return this._views.asObservable();
  }

  /**
   * Grabs the list of views from the server.
   *
   *
   * @memberOf ViewService
   */
  refreshViews() {
    if (this.viewsUrl) {
      this.http.get(this.viewsUrl).map((res: Response) => res.json()).subscribe(response => {
        this._views.next(fromJS(response));
      });
    }
  }

  /**
   * Loads a view from the server.
   *
   * @param {any} viewsUrl
   * @param {any} name
   * @returns {Observable<View>}
   *
   * @memberOf ViewService
   */
  loadView(viewsUrl, name): Observable<View> {
    // This is part of the bigger twiglet loading, if there is no view, it just needs to return an empty
    // view so that the loading can continue.
    if (name) {
      return this.http.get(viewsUrl).map((res: Response) => res.json()).flatMap(viewsArray => {
        const viewUrl = viewsArray.filter(view => view.name === name)[0].url;
        return this.http.get(viewUrl).map((res: Response) => res.json())
        .flatMap((response: View) => {
          return this.userStateService.loadUserState(response.userState)
          .flatMap(() => Observable.of(response));
        })
        .catch(handleError.bind(this));
      });
    }
    return Observable.of({
      links: {},
      nodes: {},
    });
  }

  /**
   * Sanitizes a view so only the important stuff is stored.
   *
   * @returns {ViewUserState}
   *
   * @memberOf ViewService
   */
  private prepareViewForSending(): ViewUserState {
    const requiredKeys = [
      'autoConnectivity',
      'autoScale',
      'alphaTarget',
      'bidirectionalLinks',
      'cascadingCollapse',
      'currentNode',
      'filters',
      'forceChargeStrength',
      'forceGravityX',
      'forceGravityY',
      'forceLinkDistance',
      'forceLinkStrength',
      'forceVelocityDecay',
      'gravityPoints',
      'linkType',
      'nodeSizingAutomatic',
      'scale',
      'separationDistance',
      'showLinkLabels',
      'showNodeLabels',
      'treeMode',
      'traverseDepth',
    ];
    const state = pick(requiredKeys, this.userState.toJS()) as ViewUserState;
    if (!state.filters.length) {
      state.filters = [{
        attributes: [],
        types: { }
      }];
    }
    return state;
  }

  /**
   * Prepares links so only the attributes necessary for views are stored.
   *
   * @returns
   *
   * @memberOf ViewService
   */
  private prepareLinksForSending() {
    const requiredKeys = ['source', 'sourceOriginal', 'target', 'targetOriginal'];
    const links = this.twiglet.get('links') as Map<string, Map<string, any>>;
    return links.reduce((manyLinks, link) => {
      manyLinks[link.get('id')] = requiredKeys.reduce((linkObject, key) => {
        linkObject[key] = link.get(key);
        return linkObject;
      }, {});
      return manyLinks;
    }, {});
  }

  /**
   * Creates a view and saves it to the server.
   *
   * @param {any} name
   * @param {any} [description]
   * @returns
   *
   * @memberOf ViewService
   */
  createView(name, description?) {
    const userStateObject = this.prepareViewForSending();
    const viewToSend: View = {
      description,
      links: this.prepareLinksForSending(),
      name,
      nodes: this.nodeLocations.toJS(),
      userState: userStateObject,
    };
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}/${this.twiglet.get('name')}/views`, viewToSend, authSetDataOptions)
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

  /**
   * Overwrites a view on the server.
   *
   * @param {any} viewUrl
   * @param {any} name
   * @param {any} description
   * @returns
   *
   * @memberOf ViewService
   */
  saveView(viewUrl, name, description) {
    const userStateObject = this.prepareViewForSending();
    const viewToSend: View = {
      description,
      links: this.prepareLinksForSending(),
      name,
      nodes: this.nodeLocations.toJS(),
      userState: userStateObject,
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

  /**
   * Removes a view from the server.
   *
   * @param {any} viewUrl
   * @returns
   *
   * @memberOf ViewService
   */
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

