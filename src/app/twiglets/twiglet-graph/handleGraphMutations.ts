import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';

import { D3Node, isD3Node, Link } from '../../../non-angular/interfaces';
import { FilterByObjectPipe } from './../../shared/pipes/filter-by-object.pipe';
import { getNodeImage, getSizeFor } from './nodeAttributesToDOMAttributes';
import { Links } from './../../../non-angular/interfaces/twiglet/link';
import { scaleNodes } from './locationHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { getColorFor } from './nodeAttributesToDOMAttributes';

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
  let linkWarning = false;
  this.allLinks = mapImmutableMapToArrayOfNodes<Link>(response.get('links')).map(link => {
    const newLink = merge({}, link);
    this.allLinksObject[link.id] = newLink;

    // map links to actual nodes instead of just ids.
    newLink.source = this.allNodesObject[<string>newLink.source];
    newLink.target = this.allNodesObject[<string>newLink.target];
    if (newLink.source && newLink.target) {
      if (!this.linkSourceMap[newLink.source.id]) {
        this.linkSourceMap[newLink.source.id] = [newLink.id];
      } else {
        this.linkSourceMap[newLink.source.id].push(newLink.id);
      }

      if (!this.linkTargetMap[newLink.target.id]) {
        this.linkTargetMap[newLink.target.id] = [newLink.id];
      } else {
        this.linkTargetMap[newLink.target.id].push(newLink.id);
      }
    } else {
      console.warn(`link is not mapped to a node correctly`, link);
      linkWarning = true;
    }
    return newLink;
  });
  if (linkWarning) {
    this.toastr.warning('some links did not map correctly, check console');
  }

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
