import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map } from 'immutable';

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
      currentNode: null,
      currentTwigletName: null,
      currentViewName: null,
      isEditing: false,
      nodeTypeToBeAdded: null,
      showNodeLabels: false,
      sortNodesAscending: true,
      sortNodesBy: 'type',
      textToFilterOn: null,
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
   * Clears the current node type that would be added to the twiglet.
   *
   *
   * @memberOf UserStateService
   */
  clearNodeTypeToBeAdded() {
    this._userState.next(this._userState.getValue().set('nodeTypeToBeAdded', null));
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
   * Sets showing of node labels on svg.
   *
   * @param {boolean} bool
   *
   * @memberOf UserStateService
   */
  setShowNodeLabels(bool: boolean) {
    console.log('set to', bool);
    this._userState.next(this._userState.getValue().set('showNodeLabels', bool));
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
  toggleSortNodesAscending() {
    console.log('here?!');
    const userState = this._userState.getValue();
    this._userState.next(userState.set('sortNodesAscending', !userState.get('sortNodesAscending')));
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
