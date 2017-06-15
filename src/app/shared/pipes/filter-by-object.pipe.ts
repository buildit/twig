import { Pipe, PipeTransform } from '@angular/core';
import { List, Map } from 'immutable';
import { clone } from 'ramda';

import { Link, D3Node } from './../../../non-angular/interfaces';

@Pipe({
  name: 'filterByObject'
})
export class FilterByObjectPipe implements PipeTransform {
  transform(d3Nodes: D3Node[], links: Link[], filters: List<Map<string, any>>): any {
    const linksClone = links;
    if (!filters.size || !d3Nodes.length) {
      return d3Nodes;
    }
    const nodesAsObjects = d3Nodes.reduce((object, d3Node) => {
      d3Node.hiddenByFilters = true;
      object[d3Node.id] = d3Node;
      return object;
    }, {});
    const linkMapWithSourcesAsKey = links.reduce((object, link, id) => {
      const { source, target } = link;
      const sourceNode = nodesAsObjects[source as string] as D3Node;
      if (sourceNode) {
        if (object[sourceNode.id]) {
          object[sourceNode.id].push(link);
        } else {
          object[sourceNode.id] = [link];
        }
      }
      return object;
    }, {});

    filters.forEach(filter => {
      d3Nodes.forEach(node => compareNodeToFilter(filter, node, nodesAsObjects, linkMapWithSourcesAsKey));
    });
    const filtered = d3Nodes.filter(node => node.hiddenByFilters === false);
    return filtered;
  }
}

function compareNodeToFilter(filter: Map<string, any>, node: D3Node, nodesAsObjects: { [key: string]: D3Node }, linkMapWithSourcesAsKey) {
  const match = filter.reduce((object, value, key) => {
    object[value] = null;
    return object;
  }, {});
  if (filter.get('type')) {
    match['type'] = node.type === filter.get('type');
  }
  if (!alreadyFailed(match) && filter.get('attributes')) {
    match['attribute'] = filter.get('attributes')
      .filter(attribute => attribute.get('key'))
      .every(attribute => {
        const matchingAttributesOnNode = node.attrs.filter(attr => attr.key === attribute.get('key'));
        if (matchingAttributesOnNode.length === 0) {
          return false;
        }
        if (attribute.get('value') === undefined || attribute.get('value') === '') {
          return true;
        }
        return matchingAttributesOnNode.some(attr => attr.value === attribute.get('value'));
      });
  }
  if (!alreadyFailed(match)) {
    node.hiddenByFilters = false;
  }
  if (filter.get('_target') && node.hiddenByFilters === false) {
    const links = <Link[]>linkMapWithSourcesAsKey[node.id];
    if (links) {
      links.forEach(link => {
        const target = nodesAsObjects[link.target as string];
        compareNodeToFilter(filter.get('_target'), target, nodesAsObjects, linkMapWithSourcesAsKey);
      });
    }
  }
}

function alreadyFailed(object: { [key: string]: boolean }) {
  return Reflect.ownKeys(object).some(key => object[key] === false);
}
