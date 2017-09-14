import { Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Simulation } from 'd3-ng2-service';
import { fromJS, List, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { authSetDataOptions, handleError } from '../httpHelpers';
import { Config } from '../../config';
import { ConnectType, GravityPoint, LinkType, Scale, ScaleType } from '../../interfaces';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';
import { UserState } from './../../interfaces/userState/index';
import { ViewUserState } from './../../interfaces/twiglet/view';

/**
 * Contains all of the information and modifiers about the current user state (what buttons clicked,
 * toggles toggled, etc)
 *
 * @export
 * @class UserStateService
 */
export class UserStateService {
  /**
   * The default values for a twiglet
   *
   * @private
   * @type {Map<string, any>}
   * @memberOf UserStateService
   */
  private _defaultState: Map<string, any> = fromJS({
    addingGravityPoints: false,
    alphaTarget: 0.00,
    autoConnectivity: 'in',
    cascadingCollapse: false,
    collisionDistance: 15,
    copiedNodeId: null,
    currentEvent: null,
    currentNode: null,
    currentViewName: null,
    editTwigletModel: false,
    eventFilterText: null,
    filters: Map({}),
    forceChargeStrength: 0.1,
    forceGravityX: 0.5,
    forceGravityY: 0.5,
    forceLinkDistance: 20,
    forceLinkStrength: 0.5,
    forceVelocityDecay: 0.9,
    formValid: true,
    gravityPoints: Map({}),
    highlightedNode: '',
    isEditing: false,
    isEditingGravity: false,
    isPlayingBack: false,
    isSimulating: false,
    levelFilter: '-1',
    levelFilterMax: 0,
    linkType: 'path',
    mode: 'home',
    nodeTypeToBeAdded: null,
    ping: Map({}),
    playbackInterval: 5000,
    renderOnEveryTick: true,
    runSimulation: true,
    scale: 3,
    separationDistance: 15,
    showLinkLabels: false,
    showNodeLabels: false,
    textToFilterOn: null,
    traverseDepth: 3,
    treeMode: false,
    user: null,
  });
  /**
   * The actual item being observed, modified. Private to maintain immutability.
   *
   * @private
   * @type {BehaviorSubject<Map<string, any>>}
   * @memberOf UserStateService
   */
  private _userState: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(this._defaultState);

  private _intervalCounterId: any = 0;
  public interval = 500; // in milliseconds
  private _spinnerVisible = true;
  public modelRef;

  constructor(private http: Http, private router: Router, public modalService: NgbModal) {
    const url = `${Config.apiUrl}/ping`;
    this.http.get(url, authSetDataOptions)
    .map((res: Response) => res.json())
    .subscribe(response => {
      this._userState.next(this._userState.getValue().set('ping', response));
      if (response.authenticated) {
        this._userState.next(this._userState.getValue().set('user', response.authenticated));
      }
    });
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/model/')) {
        this.setMode('model');
      } else if (event.url.startsWith('/twiglet/')) {
        if (event.url.endsWith('model')) {
          this.setMode('twiglet.model');
        } else {
          this.setMode('twiglet');
        }
      } else {
        this.setMode('home');
      }
    });
  }


  /**
   * Returns an observable, because BehaviorSubject is used, first time subscribers get the current state.
   *
   * @readonly
   * @type {Observable<Map<string, any>>}
   * @memberOf UserStateService
   */
  get observable(): Observable<Map<string, any>> {
    return this._userState.asObservable();
  }

  /**
   * Resets everything to the default state.
   *
   *
   * @memberOf UserStateService
   */
  resetAllDefaults() {
    const doNotReset = {
      addingGravityPoints: true,
      copiedNodeId: true,
      currentNode: true,
      currentViewName: true,
      editTwigletModel: true,
      formValid: true,
      highlightedNode: true,
      isEditing: true,
      isEditingGravity: true,
      mode: true,
      nodeTypeToBeAdded: true,
      ping: true,
      renderOnEveryTick: true,
      runSimulation: true,
      textToFilterOn: true,
      user: true,
    };
    let currentState = this._userState.getValue();
    currentState.keySeq().forEach(key => {
      if (!doNotReset[key]) {
        currentState = currentState.set(key, this._defaultState.get(key));
      }
    });
    this._userState.next(currentState);
  }

  /**
   * Logs a user into the api.
   *
   * @param {any} body
   * @returns
   *
   * @memberOf UserStateService
   */
  logIn(body) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    const url = `${Config.apiUrl}/login`;
    return this.http.post(url, body, options).map((res: Response) => res.json())
      .flatMap(response => {
        this.setCurrentUser(response.user);
        return Observable.of(response.user);
      })
      .catch((error) => {
        handleError(error);
        return Observable.throw(error);
      });
  }

  /**
   * Logs the user out of the api.
   *
   *
   * @memberOf UserStateService
   */
  logOut() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    const url = `${Config.apiUrl}/logout`;

    return this.http.post(url, options).subscribe(response => {
      this._userState.next(this._userState.getValue().set('user', null));
    });
  }

  /**
   * Logs in the user by sending a JWT generated by Azure.
   *
   * @param {any} jwt
   * @returns
   *
   * @memberof UserStateService
   */
  loginViaMothershipAd(jwt: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    const url = `${Config.apiUrl}/validateJwt`;
    return this.http.post(url, { jwt }, options)
    .map((res: Response) => res.json())
    .flatMap(response => {
      this.setCurrentUser(response.user);
      return Observable.of(response.user);
    })
    .catch((error) => {
      handleError(error);
      return Observable.throw(error);
    });
  }

  /**
   * Takes a userState (view) and loads it into the current state.
   *
   * @param {ViewUserState} userState
   * @returns
   *
   * @memberOf UserStateService
   */
  loadUserState(userState: ViewUserState) {
    let currentState = this._userState.getValue().asMutable();
    Reflect.ownKeys(userState).forEach(key => {
      currentState = currentState.set(key as string, fromJS(userState[key]));
    });
    this._userState.next(currentState.asImmutable());
    return Observable.of(userState);
  }

  /**
   * Sets the current user (usually called via login and not via user actions.)
   *
   * @param {any} email
   *
   * @memberOf UserStateService
   */
  setCurrentUser(userInfo) {
    const user = {
      user: {
        id: userInfo.id,
        name: userInfo.name
      }
    };
    this._userState.next(this._userState.getValue().set('user', user));
  }

  /**
   * Sets the alpha target for the twig graph.
   *
   * @param {number} target the target
   *
   * @memberof UserStateService
   */
  setAlphaTarget(target: number) {
    this._userState.next(this._userState.getValue().set('alphaTarget', target));
  }


  /**
   * Sets the autoconnectivity type, supported values are "in", "out" and "both"
   *
   * @param {string} connectType
   *
   * @memberOf UserStateService
   */
  setAutoConnectivity(connectType: ConnectType) {
    this._userState.next(this._userState.getValue().set('autoConnectivity', connectType));
  }

  /**
   * Turns cascading collapse on and off.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setCascadingCollapse(bool: boolean) {
    this._userState.next(this._userState.getValue().set('cascadingCollapse', bool));
  }

  setCollisionDistance(distance: number) {
    this._userState.next(this._userState.getValue().set('collisionDistance', distance));
  }

  /**
   * Sets the current event id.
   *
   * @param {string} id
   *
   * @memberOf UserStateService
   */
  setCurrentEvent(id: string) {
    this._userState.next(this._userState.getValue().set('currentEvent', id));
  }

  /**
   * Sets the current node selected by the user.
   *
   * @param {string} id string id of the node
   *
   * @memberOf UserStateService
   */
  setCurrentNode(id: string) {
    this._userState.next(this._userState.getValue().set('currentNode', id));
  }

  /**
   * Copies the currently selected node
   *
   *
   * @memberOf UserStateService
   */
  setCopiedNodeId() {
    const userState = this._userState.getValue();
    this._userState.next(userState.set('copiedNodeId', userState.get('currentNode')));
  }

  /**
   * Removes a current node selected by the user (if any)
   *
   *
   * @memberOf UserStateService
   */
  clearCurrentNode() {
    this._userState.next(this._userState.getValue().set('currentNode', ''));
  }

  /**
   * Sets the current twiglet selected by the user.
   *
   * @param {string} name string name of the view
   *
   * @memberOf UserStateService
   */
  setCurrentView(name: string) {
    this._userState.next(this._userState.getValue().set('currentViewName', name));
  }

  /**
   * Clears the current View to null.
   *
   *
   * @memberOf UserStateService
   */
  clearCurrentView() {
    this._userState.next(this._userState.getValue().set('currentViewName', null));
  }

  /**
   * Sets the charge strength of the Simulation.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceChargeStrength(number: number) {
    this._userState.next(this._userState.getValue().set('forceChargeStrength', number));
  }

  /**
   * Sets the gravity along the x-axis.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceGravityX(number: number) {
    this._userState.next(this._userState.getValue().set('forceGravityX', number));
  }

  /**
   * Sets the gravity along the y-axis.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceGravityY(number: number) {
    this._userState.next(this._userState.getValue().set('forceGravityY', number));
  }

  /**
   * Sets the distance between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceLinkDistance(number: number) {
    this._userState.next(this._userState.getValue().set('forceLinkDistance', number));
  }

  /**
   * Sets the strength between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceLinkStrength(number: number) {
    this._userState.next(this._userState.getValue().set('forceLinkStrength', number));
  }

  /**
   * Sets the strength between links on the force graph.
   *
   * @param {number} number
   *
   * @memberOf UserStateService
   */
  setForceVelocityDecay(number: number) {
    this._userState.next(this._userState.getValue().set('forceVelocityDecay', number));
  }

  /**
   * Sets edit mode to true or false
   *
   * @param {boolean} bool desired edit mode.
   *
   * @memberOf UserStateService
   */
  setEditing(bool: boolean) {
    if (bool) {
      this._userState.next(this._userState.getValue().set('isEditing', bool).set('isSimulating', false));
    } else {
      this._userState.next(this._userState.getValue().set('isEditing', bool).set('editTwigletModel', false));
    }
  }

  /**
   * Sets edit gravity mode to true or false
   *
   * @param {boolean} bool desired edit mode.
   *
   * @memberOf UserStateService
   */
  setGravityEditing(bool: boolean) {
    this._userState.next(this._userState.getValue().set('isEditingGravity', bool));
  }

  /**
   * Used to indicate that a playback is happening.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setPlayingBack(bool: boolean) {
    this._userState.next(this._userState.getValue().set('isPlayingBack', bool));
  }

  /**
   * Used to indicate that D3 is currently simulating is happening.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setSimulating(bool: boolean) {
    this._userState.next(this._userState.getValue().set('isSimulating', bool));
  }

  /**
   * Sets adding gravity points state (to trigger correct click events) to true or false
   *
   * @param {boolean} bool desired edit mode.
   *
   * @memberOf UserStateService
   */
  setAddGravityPoints(bool: boolean) {
    this._userState.next(this._userState.getValue().set('addingGravityPoints', bool));
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
    this._userState.next(this._userState.getValue().setIn(['gravityPoints', gravityPoint.id], Map(gravityPoint)));
  }

  /**
   * Sets the gravity points.
   *
   * @param {Object} gravityPoints
   *
   * @memberof UserStateService
   */
  setGravityPoints(gravityPoints: Object) {
    this._userState.next(this._userState.getValue().set('gravityPoints', fromJS(gravityPoints)));
  }

  /**
   * Sets the max level of nodes to display.
   *
   * @param {number} level
   *
   * @memberof UserStateService
   */
  setLevelFilter(level: number) {
    this._userState.next(this._userState.getValue().set('levelFilter', level));
  }

  /**
   * Sets the max level of nodes to display.
   *
   * @param {number} level
   *
   * @memberof UserStateService
   */
  setLevelFilterMax(maxLevel: number) {
    this._userState.next(this._userState.getValue().set('levelFilterMax', maxLevel));
  }

  /**
   * Sets the link type, supported values are "path" (curves) and "line" (straight)
   *
   * @param {LinkType} linkType
   *
   * @memberOf UserStateService
   */
  setLinkType(linkType: LinkType) {
    this._userState.next(this._userState.getValue().set('linkType', linkType));
  }

  /**
   * Sets the current node type to be added to the twiglet by dragging.
   *
   * @param {string} type the type of node to be added to the twiglet.
   *
   * @memberOf UserStateService
   */
  setNodeTypeToBeAdded(type: string) {
    this._userState.next(this._userState.getValue().set('nodeTypeToBeAdded', type));
  }

  /**
   * Sets the playback interval for sequences.
   *
   * @param {number} n
   *
   * @memberOf UserStateService
   */
  setPlaybackInterval(n: number) {
    this._userState.next(this._userState.getValue().set('playbackInterval', n));
  }

  /**
   * Sets the mode (twiglet, model, etc)
   *
   * @param {string} mode
   *
   * @memberOf UserStateService
   */
  setMode(mode: string) {
    this._userState.next(this._userState.getValue().set('mode', mode));
  }

  /**
   * Sets the text used to filter out events.
   *
   * @param {any} text
   *
   * @memberOf UserStateService
   */
  setEventFilterText(text: string) {
    this._userState.next(this._userState.getValue().set('eventFilterText', text));
  }

  /**
   * Sets the filters
   *
   * @param {Object} filters
   *
   * @memberOf UserStateService
   */
  setFilter(filters: Object) {
    this._userState.next(this._userState.getValue().set('filters', fromJS(filters)));
  }

  /**
   * If D3 should redraw the graph on every tick.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setRenderOnEveryTick(bool: boolean) {
    this._userState.next(this._userState.getValue().set('renderOnEveryTick', bool));
  }

  /**
   * If D3 should even be simulating
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setRunSimulation(bool: boolean) {
    this._userState.next(this._userState.getValue().set('runSimulation', bool));
  }

  /**
   * Sets the scale of the nodes
   *
   * @param {number} scale
   *
   * @memberOf UserStateService
   */
  setScale(scale: Scale) {
    this._userState.next(this._userState.getValue().set('scale', scale));
  }

  /**
   * Sets the distance between the nodes to avoid collisions
   *
   * @param {number} distance
   *
   * @memberof UserStateService
   */
  setSeparationDistance(distance: number) {
    this._userState.next(this._userState.getValue().set('separationDistance', distance));
  }

  /**
   * Sets showing of node labels on svg.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setShowNodeLabels() {
    const current = this._userState.getValue().get('showNodeLabels');
    this._userState.next(this._userState.getValue().set('showNodeLabels', !current));
  }

  /**
   * Toggles the display of node names.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setShowLinkLabels() {
    const current = this._userState.getValue().get('showLinkLabels');
    this._userState.next(this._userState.getValue().set('showLinkLabels', !current));
  }

  /**
   * Sets the current node type to be added to the twiglet by dragging.
   *
   * @param {string} type the type of node to be added to the twiglet.
   *
   * @memberOf UserStateService
   */
  setTextToFilterOn(text: string) {
    this._userState.next(this._userState.getValue().set('textToFilterOn', text));
  }

  /**
   * Turns treeMode on (true) or off (false)
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setTreeMode(bool: boolean) {
    this._userState.next(this._userState.getValue().set('treeMode', bool));
  }

  /**
   * Sets the whether a form is valid or invalid.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setFormValid(bool: boolean) {
    this._userState.next(this._userState.getValue().set('formValid', bool));
  }

  /**
   * sets the highlighted node
   *
   * @param {string} id
   *
   * @memberOf UserStateService
   */
  setHighLightedNode(id: string) {
    const userState = this._userState.getValue();
    if (userState.get('highlightedNode') !== id) {
      this._userState.next(userState.set('highlightedNode', id));
    }
  }

  /**
   * sets the current app mode to editing a twiglet's model
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setTwigletModelEditing(bool: boolean) {
    this._userState.next(this._userState.getValue().set('editTwigletModel', bool));
  }

  /**
   * starts the loading spinner to bring up the loading modal
   *
   *
   *
   * @memberOf UserStateService
   */
  startSpinner() {
    if (!this.modelRef) {
      this.modelRef = this.modalService.open(LoadingSpinnerComponent, { windowClass: 'modal-top', size: 'sm', backdrop: 'static'});
    }
  }

  /**
   * stops the loading spinner and closes the loading modal
   *
   *
   *
   * @memberOf UserStateService
   */
  stopSpinner() {
    if (this.modelRef) {
      this.modelRef.close();
      this.modelRef = null;
      return true;
    }
    return false;
  }
}
