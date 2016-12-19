import { Map, OrderedMap } from 'immutable';

import { D3Node, Link } from '../interfaces';

import { TwigletGraphComponent } from './twiglet-graph.component';
import { getNodeImage } from './nodeAttributeToDOMAttributes';


export function handleNodeMutations (this: TwigletGraphComponent, response) {
  // Just add the node to our array and update d3
  if (this.currentNodeState.data !== response.data) {
    // Remove nodes that should no longer be here first.
    const tempObject = {};
    // Add and sync existing nodes.
    mapImmutableMapToArrayOfNodes<D3Node>(response.data).forEach(node => {
      tempObject[node.id] = node;

      // Add new nodes that are not currently in the force graph or sync up the name and image.
      if (!this.currentNodesObject[node.id]) {
        this.currentNodes.push(node);
        this.currentNodesObject[node.id] = node;
      } else {
        let group;
        if (node.type !== this.currentNodesObject[node.id].type) {
          this.currentNodesObject[node.id].type = node.type;
          group = this.d3.select(`#id-${node.id}`);
          group.select('.image').text(getNodeImage(node));
        }
        if (node.name !== this.currentNodesObject[node.id].name) {
          this.currentNodesObject[node.id].name = node.name;
          group = group || this.d3.select(`#id-${node.id}`);
          group.select('.image').text(name);
        }
      }
    });

    // Remove nodes that no longer exist.
    for (let i = this.currentNodes.length - 1; i >= 0; i--) {
      const node = this.currentNodes[i];
      if (!tempObject[node.id]) {
        this.currentNodes.splice(i, 1);
        delete this.currentNodesObject[node.id];
      }
    }

    this.restart();
  }
}

export function handleLinkMutations (this: TwigletGraphComponent, response) {
  if (response.action === 'initial') {
    this.currentLinks = mapImmutableMapToArrayOfNodes<Link>(response.data);
  } else if (response.action === 'addLinks') {
    this.currentLinks.length = 0;
    mapImmutableMapToArrayOfNodes<Link>(response.data).forEach(link => {
      // Convert string ids into actual nodes.
      link.source = this.currentNodesObject[link.source];
      link.target = this.currentNodesObject[link.target];
      this.currentLinks.push(link);
    });
    this.restart();
  }
}

function mapImmutableMapToArrayOfNodes<Type>(map: OrderedMap<string, Map<string, any>>) {
  return map.reduce((array: Type[], node: Map<string, any>) => {
    array.push(node.toJS());
    return array;
  }, []);
}
