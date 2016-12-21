import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { D3Node } from '../../interfaces/twiglet';

export class NodesService {

  private _nodes: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(OrderedMap<string, Map<string, any>>({}));

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._nodes.asObservable();
  }

  addNode(newNode: D3Node, stateCatcher?: StateCatcher) {
    this.addNodes([newNode], stateCatcher);
  }

  addNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().asMutable();
    const newState = newNodes.reduce((mutable, node) => {
      return mutable.set(node.id, fromJS(node));
    }, mutableNodes).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) {
    this.updateNodes([updatedNode], stateCatcher);
  }

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

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) {
    this.removeNodes([removedNode], stateCatcher);
  }

  removeNodes(removedNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().asMutable();
    const newState = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodes).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }
}

export class NodesServiceStub extends NodesService {

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return Observable.of(OrderedMap({
      firstNode: Map({
        id: 'firstNode',
        name: 'firstNodeName',
        type: '@',
        x: 100,
        y: 100,
      }),
      secondNode: Map({
        id: 'secondNode',
        name: 'secondNodeName',
        type: '#',
        x: 200,
        y: 300,
      }),
      thirdNode: Map({
        id: 'thirdNode',
        name: 'thirdNodeName',
        type: '$',
      }),
    }));
  }

  addNode(newNode: D3Node, stateCatcher?: StateCatcher) { }

  addNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) { }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) { }

  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) { }

  removeNodes(removedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  bulkReplaceNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) { }
}
