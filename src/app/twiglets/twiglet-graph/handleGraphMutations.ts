import { Map, OrderedMap } from 'immutable';
import { clone } from 'ramda';

import { D3Node, isD3Node, Link } from '../../../non-angular/interfaces';
import { FilterByObjectPipe } from './../../shared/pipes/filter-by-object.pipe';
import { getNodeImage } from './nodeAttributesToDOMAttributes';
import { Links } from './../../../non-angular/interfaces/twiglet/link';
import { scaleNodes } from './locationHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

/**
 * This handles all changes to the nodes and links array. Adding, updating and removing.
 *
 * @param {OrderedMap} response The immutable map of nodes
 *
 * @export
 */

export function handleGraphMutations (this: TwigletGraphComponent, response: Map<string, any>) {
  this.twiglet = response;
  // Remove nodes that should no longer be here first.
  this.allNodesObject = {};
  // Add and sync existing nodes.
  this.allNodes = mapImmutableMapToArrayOfNodes<D3Node>(response.get('nodes'));
  this.allNodes.forEach(node => {
    this.allNodesObject[node.id] = node;
  });

  // Clear our allLinksObject because we have new Links.
  this.allLinksObject = {};
  this.linkSourceMap = {};
  this.linkTargetMap = {};
  // Add and sync existing links.
  this.allLinks = mapImmutableMapToArrayOfNodes<Link>(response.get('links'));
  this.allLinks.forEach(link => {
    this.allLinksObject[link.id] = link;

    // map links to actual nodes instead of just ids.
    link.source = this.allNodesObject[<string>link.source];
    link.target = this.allNodesObject[<string>link.target];

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
  });

  if (this.currentTwigletId !== response.get('name') && !this.userState.get('isEditing')) {
    this.currentTwigletId = response.get('name');
    this.ngZone.runOutsideAngular(() => {
      this.simulation.restart();
    });
  }

    // update link names
  this.links.each((link: Link) => {
    const existingLink = this.allLinksObject[link.id];
    if (existingLink) {
      let group;
      if (link.association !== existingLink.association) {
        group = group || this.d3.select(`#id-${link.id}`);
        group.select('.link-name').text(existingLink.association);
      }
    }
  });

  // update names and image.
  const updateSize = !this.userState.get('nodeSizingAutomatic');
  this.nodes.each((node: D3Node) => {
    const existingNode = this.allNodesObject[node.id];
    if (existingNode) {
      let group;
      if (node.type !== existingNode.type) {
        group = this.d3.select(`#id-${node.id}`);
        group.select('.node-image')
        .text(getNodeImage.bind(this)(existingNode));
      }
      if (updateSize && node.radius !== existingNode.radius) {
        group = group || this.d3.select(`#id-${node.id}`);
        group.select('.node-image')
        .attr('font-size', existingNode.radius);
      }
      if (node.name !== existingNode.name) {
        group = group || this.d3.select(`#id-${node.id}`);
        group.select('.node-name').text(existingNode.name);
      }
    }
  });
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
    array.push(clone(node.toJS()));
    return array;
  }, []);
}
