import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { pick, merge } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { ConnectType, GravityPoint, LinkType, Scale, ScaleType } from '../../interfaces';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { TwigletService } from './index';
import { UserStateService } from './../userState/index';
import { View, ViewUserState } from '../../interfaces';
import { ViewNode } from './../../interfaces/twiglet/view';
import VIEW from './constants/view';
import VIEW_DATA from './constants/view/data';
import TWIGLET from './constants';
import LINK from './constants/link'

export class ViewService {
  private viewsUrl;
  private nodeLocations: { [key: string]: ViewNode };
  private twiglet;

  private _defaultState = {
    alphaTarget: 0.00,
    autoConnectivity: 'in',
    cascadingCollapse: false,
    collisionDistance: 15,
    filters: Map({}),
    forceChargeStrength: 0.1,
    forceGravityX: 0.5,
    forceGravityY: 0.5,
    forceLinkDistance: 20,
    forceLinkStrength: 0.5,
    forceVelocityDecay: 0.9,
    gravityPoints: Map({}),
    levelFilter: '-1',
    linkType: 'path',
    renderOnEveryTick: true,
    runSimulation: true,
    scale: 3,
    separationDistance: 15,
    showLinkLabels: false,
    showNodeLabels: false,
    traverseDepth: 3,
    treeMode: false,
  };

  private _view: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(fromJS({ data: this._defaultState }));

  private _views: BehaviorSubject<List<Map<string, any>>> =
      new BehaviorSubject(List<Map<string, any>>([Map<string, any>({})]));

  private _events: BehaviorSubject<string> =
      new BehaviorSubject('initial');

  constructor(private http: Http,
              private parent: TwigletService,
              private toastr: ToastsManager) {
    parent.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      if (twiglet.get(TWIGLET.VIEWS_URL) !== this.viewsUrl) {
        this.viewsUrl = twiglet.get(TWIGLET.VIEWS_URL);
        this.refreshViews();
      }
    });
    parent.nodeLocations.subscribe(nodeLocations => {
      this.nodeLocations = nodeLocations;
    });
  }

  /**
   * Returns the views
   *
   * @readonly
   * @type {Observable<Map<string, any>>}
   * @memberOf ViewService
   */
  get observable(): Observable<Map<string, any>> {
    return this._view.asObservable();
  }

  /**
   * Returns a list of the views
   *
   * @readonly
   * @type {Observable<Map<string, any>>}
   * @memberOf ViewService
   */
  get views(): Observable<List<Map<string, any>>> {
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
      return this.http.get(viewsUrl).map((res: Response) => res.json())
      .flatMap(viewsArray => {
        const viewUrl = viewsArray.filter(view => view.name === name)[0].url;
        return this.http.get(viewUrl).map((res: Response) => res.json())
        .flatMap((response: View) => {
          const serverDataKey = 'userState';
          const data = merge(this._defaultState, response[serverDataKey]);
          const newView = (<Map<string, any>>fromJS(response)).remove(serverDataKey).set(VIEW.DATA, data);
          this._view.next(newView);
          return Observable.of(response);
        })
        .catch((error) => {
          handleError.bind(this)(error);
           return Observable.of({
            links: {},
            name: null,
            nodes: {},
            userState: null,
          });
        });
      });
    }
    return Observable.of({
      links: {},
      name: null,
      nodes: {},
      userState: null,
    });
  }

  /**
   * Sets the alpha target for the twig graph.
   *
   * @param {number} target the target
   *
   * @memberof UserStateService
   */
  setAlphaTarget(target: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.ALPHA_TARGET], target));
  }


  /**
   * Sets the autoconnectivity type, supported values are "in", "out" and "both"
   *
   * @param {string} connectType
   *
   * @memberOf UserStateService
   */
  setAutoConnectivity(connectType: ConnectType) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.AUTO_CONNECTIVITY], connectType));
  }

  /**
   * Turns cascading collapse on and off.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setCascadingCollapse(bool: boolean) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.CASCADING_COLLAPSE], bool));
  }

  /**
   * Sets the collision distance between nodes
   *
   * @param {number} distance
   * @memberof ViewService
   */
  setCollisionDistance(distance: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.COLLISION_DISTANCE], distance));
  }

  /**
   * Sets the charge strength of the Simulation.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceChargeStrength(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_CHARGE_STRENGTH], number));
  }

  /**
   * Sets the gravity along the x-axis.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceGravityX(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_GRAVITY_X], number));
  }

  /**
   * Sets the gravity along the y-axis.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceGravityY(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_GRAVITY_Y], number));
  }

  /**
   * Sets the distance between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceLinkDistance(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_LINK_DISTANCE], number));
  }

  /**
   * Sets the strength between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceLinkStrength(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_LINK_STRENGTH], number));
  }

  /**
   * Sets the strength between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceVelocityDecay(number: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FORCE_VELOCITY_DECAY], number));
  }

  /**
   * Adds the new gravity point to the gravity points object
   *
   * @param {Object} desired edit mode.
   *
   * @memberOf UserStateService
   */
  setGravityPoint(gravityPoint: GravityPoint) {
    delete gravityPoint.sx;
    delete gravityPoint.sy;
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.GRAVITY_POINTS, gravityPoint.id], Map(gravityPoint)));
  }

  /**
   * Sets the gravity points.
   *
   * @param {Object} gravityPoints
   *
   * @memberof UserStateService
   */
  setGravityPoints(gravityPoints: Object) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.GRAVITY_POINTS], fromJS(gravityPoints)));
  }

  /**
   * Sets the max level of nodes to display.
   *
   * @param {number} level
   *
   * @memberof UserStateService
   */
  setLevelFilter(level: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER], level));
  }

  /**
   * Sets the link type, supported values are "path" (curves) and "line" (straight)
   *
   * @param {LinkType} linkType
   *
   * @memberOf UserStateService
   */
  setLinkType(linkType: LinkType) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.LINK_TYPE], linkType));
  }

  /**
   * Sets the filters
   *
   * @param {Object} filters
   *
   * @memberOf UserStateService
   */
  setFilter(filters: Object) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.FILTERS], fromJS(filters)));
  }

  /**
   * If D3 should redraw the graph on every tick.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setRenderOnEveryTick(bool: boolean) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.RENDER_ON_EVERY_TICK], bool));
  }

  /**
   * If D3 should even be simulating
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setRunSimulation(bool: boolean) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.RUN_SIMULATION], bool));
  }

  /**
   * Sets the scale of the nodes
   *
   * @param {number} scale
   *
   * @memberOf UserStateService
   */
  setScale(scale: Scale) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.SCALE], scale));
  }

  /**
   * Sets the distance between the nodes to avoid collisions
   *
   * @param {number} distance
   *
   * @memberof UserStateService
   */
  setSeparationDistance(distance: number) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.SEPARATION_DISTANCE], distance));
  }

  /**
   * Sets showing of node labels on svg.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  toggleShowNodeLabels() {
    const current = this._view.getValue().getIn([VIEW.DATA, VIEW_DATA.SHOW_NODE_LABELS]);
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.SHOW_NODE_LABELS], !current));
  }

  /**
   * Toggles the display of node names.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  toggleShowLinkLabels() {
    const current = this._view.getValue().getIn([VIEW.DATA, VIEW_DATA.SHOW_LINK_LABELS]);
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.SHOW_LINK_LABELS], !current));
  }

  /**
   * Turns treeMode on (true) or off (false)
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setTreeMode(bool: boolean) {
    this._view.next(this._view.getValue().setIn([VIEW.DATA, VIEW_DATA.TREE_MODE], bool));
  }

  /**
   * Sanitizes a view so only the important stuff is stored.
   *
   * @returns {ViewUserState}
   *
   * @memberOf ViewService
   */
  private prepareViewForSending(): ViewUserState {
    const state = this._view.getValue().toJS().data as ViewUserState;
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
    const links = this.twiglet.get(TWIGLET.LINKS) as Map<string, Map<string, any>>;
    return links.reduce((manyLinks, link) => {
      manyLinks[link.get(LINK.ID)] = requiredKeys.reduce((linkObject, key) => {
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
      nodes: this.nodeLocations,
      userState: userStateObject,
    };
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}/${this.twiglet.get(TWIGLET.NAME)}/views`,
      viewToSend, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(newView => {
      this.refreshViews();
      this.toastr.success(`View ${name} created successfully`, null);
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
      nodes: this.nodeLocations,
      userState: userStateObject,
    };
    return this.http.put(viewUrl, viewToSend, authSetDataOptions)
    .map((res: Response) => res.json())
    .flatMap(newView => {
      this.refreshViews();
      this.toastr.success(`View ${name} updated successfully`, null);
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
      this.toastr.success(`View deleted`, null);
      return Observable.of(response);
    })
    .catch((errorResponse) => {
      handleError.bind(this)(errorResponse);
      return Observable.throw(errorResponse);
    });
  }
}
