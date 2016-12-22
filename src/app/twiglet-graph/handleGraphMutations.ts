import { Map, OrderedMap } from 'immutable';

import { D3Node, Link } from '../../non-angular/interfaces';

import { TwigletGraphComponent } from './twiglet-graph.component';
import { getNodeImage } from './nodeAttributesToDOMAttributes';


export function handleNodeMutations (this: TwigletGraphComponent, response) {
  // Just add the node to our array and update d3
  if (this.currentNodeState.data !== response) {
    // Remove nodes that should no longer be here first.
    const tempObject = {};
    // Add and sync existing nodes.
    mapImmutableMapToArrayOfNodes<D3Node>(response).forEach(node => {
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
          group.select('.node-image').text(getNodeImage(node));
        }
        if (node.name !== this.currentNodesObject[node.id].name) {
          this.currentNodesObject[node.id].name = node.name;
          group = group || this.d3.select(`#id-${node.id}`);
          group.select('.node-name').text(node.name);
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
  // Remove links that should no longer be here first.
    const tempObject = {};
    // Add and sync existing links.
    mapImmutableMapToArrayOfNodes<Link>(response).forEach(link => {
      tempObject[link.id] = link;

      // Add new links that are not currently in the force graph or sync up the name and image.
      if (!this.currentLinksObject[link.id]) {
        link.source = this.currentNodesObject[link.source];
        link.target = this.currentNodesObject[link.target];
        this.currentLinks.push(link);
        this.currentLinksObject[link.id] = link;
      } else {
        /* Not ready to handle this yet
        if (node.association !== this.currentNodesObject[node.id].name) {
          this.currentNodesObject[node.id].name = node.association;
          this.d3.select(`#id-${node.id}`).select('.image').text(name);
        }
        */
      }
    });

    // Remove nodes that no longer exist.
    for (let i = this.currentLinks.length - 1; i >= 0; i--) {
      const link = this.currentLinks[i];
      if (!tempObject[link.id]) {
        this.currentLinks.splice(i, 1);
        delete this.currentLinksObject[link.id];
      }
    }

    this.restart();
}

function mapImmutableMapToArrayOfNodes<Type>(map: OrderedMap<string, Map<string, any>>) {
  return map.reduce((array: Type[], node: Map<string, any>) => {
    array.push(node.toJS());
    return array;
  }, []);
}
