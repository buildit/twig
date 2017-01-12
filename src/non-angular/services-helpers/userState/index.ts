import { Simulation } from 'd3-ng2-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map } from 'immutable';

import { ConnectType, ScaleType, LinkType, Scale } from '../../interfaces';

/**
 * Contains all of the informatio and modifiers about the current user state (what buttons clicked,
 * toggles toggled, etc)
 *
 * @export
 * @class UserStateService
 */
export class UserStateService {
  /**
   * The actual item being observed, modified. Private to maintain immutability.
   *
   * @private
   * @type {BehaviorSubject<Map<string, any>>}
   * @memberOf UserStateService
   */
  private _userState: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map({
      autoConnectivity: 'in',
      autoScale: 'linear',
      bidirectionalLinks: true,
      cascadingCollapse: true,
      copiedNodeId: null,
      currentNode: null,
      currentTwigletName: null,
      currentViewName: null,
      filterEntities: [],
      forceChargeStrength: 50,
      forceGravityX: 0.1,
      forceGravityY: 0.1,
      forceLinkDistance: 20,
      forceLinkStrength: 0.5,
      forceVelocityDecay: 0.9,
      isEditing: false,
      linkType: 'path',
      nodeSizingAutomatic: true,
      nodeTypeToBeAdded: null,
      scale: 3,
      showNodeLabels: false,
      sortNodesAscending: true,
      sortNodesBy: 'type',
      textToFilterOn: null,
      traverseDepth: 3,
      treeMode: false,
    }));

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
   * Sets the auto scale, supported values are "linear", "sqrt" and "power"
   *
   * @param {ScaleType} scaleType
   *
   * @memberOf UserStateService
   */
  setAutoScale(scaleType: ScaleType) {
    this._userState.next(this._userState.getValue().set('autoScale', scaleType));
  }

  /**
   * turns bidirectional links on (true) or off (false)
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setBidirectionalLinks(bool: boolean) {
    this._userState.next(this._userState.getValue().set('bidirectionalLinks', bool));
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
    this._userState.next(this._userState.getValue().set('currentNode', null));
  }

  /**
   * Sets the current twiglet selected by the user.
   *
   * @param {string} id string id of the node
   *
   * @memberOf UserStateService
   */
  setCurrentTwiglet(id: string) {
    this._userState.next(this._userState.getValue().set('currentTwigletName', id));
  }

  /**
   * Clears the current twiglet to null.
   *
   *
   * @memberOf UserStateService
   */
  clearCurrentTwiglet() {
    this._userState.next(this._userState.getValue().set('currentTwigletName', null));
  }

  /**
   * Sets the current twiglet selected by the user.
   *
   * @param {string} id string id of the node
   *
   * @memberOf UserStateService
   */
  setCurrentView(id: string) {
    this._userState.next(this._userState.getValue().set('currentViewName', id));
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
    this._userState.next(this._userState.getValue().set('isEditing', bool));
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
   * Turns automatic node sizing on (true) and off (false)
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setNodeSizingAutomatic(bool: boolean) {
    this._userState.next(this._userState.getValue().set('nodeSizingAutomatic', bool));
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

  setFilterEntities(entities) {
    this._userState.next(this._userState.getValue().set('filterEntities', entities));
  }

  /**
   * Clears the current node type that would be added to the twiglet.
   *
   *
   * @memberOf UserStateService
   */
  clearNodeTypeToBeAdded() {
    this._userState.next(this._userState.getValue().set('nodeTypeToBeAdded', null));
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
   * Sets showing of node labels on svg.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setShowNodeLabels(bool: boolean) {
    this._userState.next(this._userState.getValue().set('showNodeLabels', bool));
  }

  /**
   * Sets the current node type to be added to the twiglet by dragging.
   *
   * @param {string} type the type of node to be added to the twiglet.
   *
   * @memberOf UserStateService
   */
  toggleSortNodesAscending() {
    const userState = this._userState.getValue();
    this._userState.next(userState.set('sortNodesAscending', !userState.get('sortNodesAscending')));
  }

  /**
   * Sets the current node type to be added to the twiglet by dragging.
   *
   * @param {string} type the type of node to be added to the twiglet.
   *
   * @memberOf UserStateService
   */
  setSortNodesBy(key: string) {
    this._userState.next(this._userState.getValue().set('sortNodesBy', key));
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
}

/**
 * Convienience function to set an object in the calling class from our response. Use this
 * to save a copy of the view to your class so that it is always Class.userState to get
 * current user state.
 *
 * @export
 * @param {Map<string, any>} response
 */
export function userStateServiceResponseToObject (response: Map<string, any>) {
  this.userState = response.toJS();
}
