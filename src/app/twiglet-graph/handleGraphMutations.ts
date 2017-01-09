import { Links } from './../../non-angular/interfaces/twiglet/link';
import { Map, OrderedMap } from 'immutable';

import { D3Node, isD3Node, Link } from '../../non-angular/interfaces';

import { TwigletGraphComponent } from './twiglet-graph.component';
import { getColorFor, getNodeImage } from './nodeAttributesToDOMAttributes';

/**
 * This handles all changes to the nodes array. Adding, updating and removing.
 *
 * @param {OrderedMap} response The immutable map of nodes
 *
 * @export
 */
export function handleNodeMutations (this: TwigletGraphComponent, response: OrderedMap<string, Map<string, any>>) {

  if (this.currentNodeState.data !== response) {
    // Remove nodes that should no longer be here first.
    this.allNodesObject = {};
    // Add and sync existing nodes.
    this.allNodes = mapImmutableMapToArrayOfNodes<D3Node>(response);
    this.allNodes.forEach(node => {
      this.allNodesObject[node.id] = node;

      // Add new nodes that are not currently in the force graph or sync up the name and image.
      if (!this.currentlyGraphedNodesObject[node.id]) {
        this.currentlyGraphedNodes.push(node);
        this.currentlyGraphedNodesObject[node.id] = node;
      } else {
        let group;
        if (node.type !== this.currentlyGraphedNodesObject[node.id].type) {
          this.currentlyGraphedNodesObject[node.id].type = node.type;
          group = this.d3.select(`#id-${node.id}`);
          group.select('.node-image').text(getNodeImage.bind(this)(node)).style('stroke', getColorFor.bind(this)(node));
        }
        if (node.name !== this.currentlyGraphedNodesObject[node.id].name) {
          this.currentlyGraphedNodesObject[node.id].name = node.name;
          group = group || this.d3.select(`#id-${node.id}`);
          group.select('.node-name').text(node.name);
        }
        Object.keys(node).forEach(key => {
          this.allNodesObject[node.id][key] = node[key];
        });
      }
    });

    // Remove nodes that no longer exist.
    for (let i = this.currentlyGraphedNodes.length - 1; i >= 0; i--) {
      const node = this.currentlyGraphedNodes[i];
      if (!this.allNodesObject[node.id] || node.hidden) {
        this.currentlyGraphedNodes.splice(i, 1);
        delete this.currentlyGraphedNodesObject[node.id];
      }
    }

    this.restart();
  }
}

/**
 * This handles all changes to the links array. Adding, updating and removing.
 *
 * @param {OrderedMap} response The immutable map of nodes
 *
 * @export
 */
export function handleLinkMutations (this: TwigletGraphComponent, response) {
    // Clear our allLinksObject because we have new Links.
    this.allLinksObject = {};
    this.linkSourceMap = {};
    this.linkTargetMap = {};
    // Add and sync existing links.
    this.allLinks = mapImmutableMapToArrayOfNodes<Link>(response);
    this.allLinks.forEach(link => {
      this.allLinksObject[link.id] = link;
      // map links to actual nodes instead of just ids.
      link.source = this.currentlyGraphedNodesObject[<string>link.source] || link.source;
      link.target = this.currentlyGraphedNodesObject[<string>link.target] || link.source;

      if (!this.linkSourceMap[link.source.id]) {
        this.linkSourceMap[link.source.id] = [link.id];
      } else {
        this.linkSourceMap[link.source.id].push(link.id);
      }

      if (!this.linkTargetMap[link.target.id]) {
        this.linkTargetMap[link.target.id] = [link.id];
      } else {
        this.linkTargetMap[link.target.id].push(link.id);
      }

      // Add new links that are not currently in the force graph or sync up the name and image.
      if (!this.currentlyGraphedLinksObject[link.id]) {
        this.currentlyGraphedLinks.push(link);
        this.currentlyGraphedLinksObject[link.id] = link;
      } else {
        /* Not ready to handle this yet
        if (node.association !== this.currentlyGraphedNodesObject[node.id].name) {
          this.currentlyGraphedNodesObject[node.id].name = node.association;
          this.d3.select(`#id-${node.id}`).select('.image').text(name);
        }
        */
      }
    });

    // Remove links that no longer exist.
    for (let i = this.currentlyGraphedLinks.length - 1; i >= 0; i--) {
      const link = this.currentlyGraphedLinks[i];
      if (!this.allLinksObject[link.id] || link.hidden) {
        this.currentlyGraphedLinks.splice(i, 1);
        delete this.currentlyGraphedLinksObject[link.id];
      }
    }

    this.restart();
}

/**
 * Convienience helper. Since the nodes come in as an Immutable map of maps and D3 needs arrays,
 * this takes care of that for us. Very similar to the immutableMapOfMaps pipe.
 *
 * @template Type
 * @param {OrderedMap<string, Map<string, any>>} map
 * @returns and array of nodes or links.
 */
function mapImmutableMapToArrayOfNodes<Type>(map: OrderedMap<string, Map<string, any>>) {
  return map.reduce((array: Type[], node: Map<string, any>) => {
    array.push(node.toJS());
    return array;
  }, []);
}
