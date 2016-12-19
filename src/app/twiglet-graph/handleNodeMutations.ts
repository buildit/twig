import { Map, OrderedMap } from 'immutable';

import { D3Node } from '../interfaces';

export function handleNodeMutations (response) {
  // Just add the node to our array and update d3
  if (response.action === 'initial') {
    this.currentNodes = mapImmutableMapToArrayOfNodes(response.data);
  } else if (response.action === 'addNodes') {
    // Most performant way to clear the array without losing the reference and making
    // d3 do a lot of extra work.
    this.currentNodes.length = 0;
    mapImmutableMapToArrayOfNodes(response.data).forEach(node =>
      this.currentNodes.push(node)
    );
    this.restart();
  } else if (response.action === 'updateNodes') {
    // This means the update was caused by d3 and that only updates the x and y, so only
    // the node locations need to be updated.  Otherwise, the only other paramaters that d3
    // needs to know about is the type and the name of the node.
    if (response.data !== this.currentNodeState.data) {
      this.currentNodes.forEach(node => {
        const nodesToUpdate = response.data as OrderedMap<string, Map<string, any>>;
        if (nodesToUpdate.has(node.id)) {
          const group = this.d3.select(`#id-${node.id}`);
          // I believe it is faster to just reassign than to check and then assign?
          group.select('.image').text(nodesToUpdate.get('id').get('type'));
          group.select('.name').text(nodesToUpdate.get('id').get('name'));
        }
      });
    }
  } else if (response.action === 'removeNodes') {
    this.currentNodes.length = 0;
    mapImmutableMapToArrayOfNodes(response.data).forEach(node =>
      this.currentNodes.push(node)
    );
    this.restart();
  }
}

function mapImmutableMapToArrayOfNodes(nodesMap: OrderedMap<string, Map<string, any>>) {
  return nodesMap.reduce((array: D3Node[], node: Map<string, any>) => {
    array.push(node.toJS());
    return array;
  }, []);
}
