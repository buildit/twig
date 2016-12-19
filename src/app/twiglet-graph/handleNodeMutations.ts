import { Map, OrderedMap } from 'immutable';

import { D3Node, Link } from '../interfaces';

import { TwigletGraphComponent } from './twiglet-graph.component';
import { getNodeImage } from './nodeAttributeToDOMAttributes';


export function handleNodeMutations (this: TwigletGraphComponent, response) {
  // Just add the node to our array and update d3
  if (response.action === 'initial') {
    this.currentNodes = mapImmutableMapToArrayOfNodes<D3Node>(response.data);
    this.currentNodes.forEach(node => {
      this.currentNodesObject[node.id] = node;
    });
  } else if (response.action === 'addNodes') {
    // Most performant way to clear the array without losing the reference and making
    // d3 do a lot of extra work.
    this.currentNodes.length = 0;
    mapImmutableMapToArrayOfNodes<D3Node>(response.data).forEach(node => {
      this.currentNodes.push(node);
      this.currentNodesObject[node.id] = node;
    });
    this.restart();
  } else if (response.action === 'updateNodes' && response.data !== this.currentNodeState.data) {
    // This only happens if the update is from outside of d3.
    this.currentNodes.forEach(node => {
      const nodesToUpdate = response.data as OrderedMap<string, Map<string, any>>;
      if (nodesToUpdate.has(node.id)) {
        const group = this.d3.select(`#id-${node.id}`);
        // I believe it is faster to just reassign than to check and then assign?
        group.select('.image').text(getNodeImage(nodesToUpdate.get(node.id).toJS() as D3Node));
        group.select('.name').text(nodesToUpdate.get(node.id).get('name'));
      }
    });
  } else if (response.action === 'removeNodes') {
    this.currentNodes.length = 0;
    mapImmutableMapToArrayOfNodes<D3Node>(response.data).forEach(node => {
      this.currentNodes.push(node);
      this.currentNodesObject[node.id] = node;
    });
    this.restart();
  }
}

export function handleLinkMutations (this: TwigletGraphComponent, response) {
  console.log('response?', response);
  if (response.action === 'initial') {
    this.currentLinks = mapImmutableMapToArrayOfNodes<Link>(response.data);
  } else if (response.action === 'addLinks') {
    console.log('adding link?');
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
