import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { D3Node } from '../../interfaces/twiglet';

/**
 * Contains all the information and modifiers for the nodes on the twiglet.
 *
 * @export
 * @class NodesService
 */
export class NodesService {

  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  private _nodes: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(OrderedMap<string, Map<string, any>>({}));

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._nodes.asObservable();
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf NodesService
   */
  addNode(newNode: D3Node) {
    this.addNodes([newNode]);
  }

  /**
   * Adds an array of nodes to the twiglet.
   *
   * @param {D3Node[]} newNodes an array of nodes be to be added.
   *
   * @memberOf NodesService
   */
  addNodes(newNodes: D3Node[]) {
    const mutableNodes = this._nodes.getValue().asMutable();
    const newState = newNodes.reduce((mutable, node) => {
      return mutable.set(node.id, fromJS(node));
    }, mutableNodes).asImmutable();
    this._nodes.next(newState);
  }

  /**
   * Updates a single node on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node} updatedNode The node to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf NodesService
   */
  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) {
    this.updateNodes([updatedNode], stateCatcher);
  }

  /**
   * Updates multiple nodes on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node[]} updatedNodes the array of nodes to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf NodesService
   */
  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().asMutable();
    const newState = updatedNodes.reduce((mutable, node) => {
      const currentNode = mutableNodes.get(node.id).toJS();
      return mutable.set(node.id, fromJS(merge(currentNode, node)));
    }, mutableNodes).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }

  /**
   * Removes a node from the twiglet.
   *
   * @param {D3Node} removedNode The node to be removed, only requires id, ignores other keys.
   *
   * @memberOf NodesService
   */
  removeNode(removedNode: D3Node) {
    this.removeNodes([removedNode]);
  }

  /**
   * Removes multiple nodes from the twiglet.
   *
   * @param {D3Node[]} removedNodes The nodes to be removed, only requires id, ignores other keys
   *
   * @memberOf NodesService
   */
  removeNodes(removedNodes: D3Node[]) {
    const mutableNodes = this._nodes.getValue().asMutable();
    const newState = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodes).asImmutable();
    this._nodes.next(newState);
  }
}

/**
 * For testing purposes only. Don't use in production. Stubs out the service.
 *
 * @export
 * @class NodesServiceStub
 * @extends {NodesService}
 */
export class NodesServiceStub extends NodesService {

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return new BehaviorSubject(OrderedMap<string, Map<string, any>>(fromJS({
      firstNode: {
        id: 'firstNode',
        name: 'firstNodeName',
        type: '@',
        x: 100,
        y: 100,
      },
      secondNode: {
        id: 'secondNode',
        name: 'secondNodeName',
        type: '#',
        x: 200,
        y: 300,
      },
      thirdNode: {
        id: 'thirdNode',
        name: 'thirdNodeName',
        type: '$',
      }
    }))).asObservable();
  }

  addNode(newNode: D3Node) { }

  addNodes(newNodes: D3Node[]) { }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) { }

  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) { }

  removeNodes(removedNodes: D3Node[]) { }

  bulkReplaceNodes(newNodes: D3Node[]) { }
}
