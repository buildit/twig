import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { NextResponse, StateCatcher } from '../index';
import { D3Node } from '../../interfaces/twiglet';

export interface NodesActionResponse extends NextResponse {
  action: string;
  data: OrderedMap<string, Map<string, D3Node>>;
  payload: D3Node[];
}

class NodesActionReponseGenerator implements NodesActionResponse {
  action: string;
  data: OrderedMap<string, Map<string, D3Node>>;
  payload: D3Node[];
  constructor(action: string, data: OrderedMap<string, Map<string, D3Node>>, payload: D3Node[]) {
    this.action = action;
    this.data = data;
    this.payload = payload;
  }
}

export class NodesService {

  private _nodes: BehaviorSubject<NodesActionResponse> =
    new BehaviorSubject({
      action: 'initial',
      data: OrderedMap<string, Map<string, any>>({}),
      payload: null,
    });

  get observable(): Observable<NodesActionResponse> {
    return this._nodes.asObservable();
  }

  addNode(newNode: D3Node, stateCatcher?: StateCatcher) {
    this.addNodes([newNode], stateCatcher);
  }

  addNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().data.asMutable();
    const newState = newNodes.reduce((mutable, node) => {
      return mutable.set(node.id, fromJS(node));
    }, mutableNodes).asImmutable();
    const next = new NodesActionReponseGenerator('addNodes', newState, newNodes);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(next);
  }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) {
    this.updateNodes([updatedNode], stateCatcher);
  }

  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().data.asMutable();
    const newState = updatedNodes.reduce((mutable, node) => {
      const currentNode = mutableNodes.get(node.id).toJS();
      return mutable.set(node.id, fromJS(merge(currentNode, node)));
    }, mutableNodes).asImmutable();
    const next = new NodesActionReponseGenerator('updateNodes', newState, updatedNodes);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(next);
  }

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) {
    this.removeNodes([removedNode], stateCatcher);
  }

  removeNodes(removedNodes: D3Node[], stateCatcher?: StateCatcher) {
    const mutableNodes = this._nodes.getValue().data.asMutable();
    const newState = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodes).asImmutable();
    const next = new NodesActionReponseGenerator('removeNodes', newState, removedNodes);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(next);
  }

  bulkReplaceNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) {
    const newState = fromJS(newNodes.reduce((object: Object, node: D3Node) => {
      object[node.id] = node;
      return object;
    }, {}));
    const next = new NodesActionReponseGenerator('bulkReplaceNodes', newState, newNodes);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(next);
  }
}

export class NodesServiceStub extends NodesService {

  get observable(): Observable<NextResponse> {
    return new BehaviorSubject({
      action: null,
      data: OrderedMap<string, Map<string, any>>({}),
      payload: null,
    });
  }

  addNode(newNode: D3Node, stateCatcher?: StateCatcher) { }

  addNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) { }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) { }

  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) { }

  removeNodes(removedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  bulkReplaceNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) { }
}
