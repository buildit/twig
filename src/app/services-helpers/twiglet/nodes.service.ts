import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../stateCatcher';
import { D3Node } from '../../interfaces/twiglet';

export class NodesService {

  private _nodes: BehaviorSubject<List<D3Node>> = new BehaviorSubject(List([]));

  get observable(): Observable<List<D3Node>> {
    return this._nodes.asObservable();
  }

  addNode(newNode: D3Node, stateCatcher?: StateCatcher) {
    const newState: List<D3Node> = this._nodes.getValue().push(newNode);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) {
    let nodes = this._nodes.getValue();
    let index = nodes.findIndex((node: D3Node) => node.id === updatedNode.id);
    let node = nodes.get(index);
    const newState = nodes.set(index, merge(node, updatedNode));
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }

  removeNode(nodeToRemove: D3Node, stateCatcher?: StateCatcher) {
    let nodes = this._nodes.getValue();
    let index = nodes.findIndex((node: D3Node) => node.id === nodeToRemove.id);
    const newState = nodes.delete(index);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }

  bulkReplaceNodes(newNodes: D3Node[], stateCatcher?: StateCatcher) {
    const newState = List(newNodes);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._nodes.next(newState);
  }
}
