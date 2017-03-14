import { Map } from 'immutable';
import { Link, D3Node } from './../../non-angular/interfaces';
import { Pipe, PipeTransform } from '@angular/core';

interface Filter {
  type?: string[] | string;
  attribute?: {
    [key: string]: string[] | string,
  };
  _targets?: Filter | boolean;
}

@Pipe({
  name: 'filterByJson'
})
export class FilterByJsonPipe implements PipeTransform {
  transform(d3Nodes: D3Node[], links: Map<string, Map<string, any>>, filterAsJSON: string): any {
    try {
      const filters = JSON.parse(filterAsJSON) as Filter[];
      if (!filters.length) {
        return d3Nodes;
      }
      const nodesAsObjects = d3Nodes.reduce((object, d3Node)   => {
        d3Node.hiddenByFilters = true;
        object[d3Node.id] = d3Node;
        return object;
      }, {});
      const linkMapWithSourcesAsKey = links.reduce((object, link, id) => {
        const linkAsJS = <Link>link.toJS();
        linkAsJS.source = nodesAsObjects[linkAsJS.source as string] as D3Node;
        linkAsJS.target = nodesAsObjects[linkAsJS.target as string] as D3Node;
        if (object[linkAsJS.source.id]) {
          object[linkAsJS.source.id].push(linkAsJS);
        } else {
          object[linkAsJS.source.id] = [linkAsJS];
        }
        return object;
      }, {});

      filters.forEach(filter => {
        d3Nodes.forEach(node => compareNodeToFilter(filter, node, getComparators(filter), linkMapWithSourcesAsKey));
      });

      return d3Nodes.filter(node => node.hiddenByFilters === false);
    } catch (error) {
      // This means the json was invalid and the user isn't done yet.
      return d3Nodes;
    }
  }
}

function compareNodeToFilter(filter: Filter, node: D3Node, [typeComparator, attributeComparatorMap], linkMapWithSourcesAsKey) {
  if (filter === true) {
    console.log('here?');
    node.hiddenByFilters = false;
    return;
  }
  const match = Reflect.ownKeys(filter).reduce((object, key) => {
    if (!key.toString().startsWith('_')) {
      object[key] = null;
    }
    return object;
  }, {});
  if (filter.type) {
    match['type'] = typeComparator(node.type, filter.type as [any, any]);
  }
  if (!alreadyFailed(match) && filter.attribute) {
    match['attribute'] = Reflect.ownKeys(filter.attribute)
      .every(key => {
        const matchingAttributesOnNode = node.attrs.filter(attr => attr.key === key);
        return matchingAttributesOnNode.some(attr => attributeComparatorMap[key](attr.value, filter.attribute[key]));
      });
  }
  if (!alreadyFailed(match)) {
    node.hiddenByFilters = false;
  }
  if (filter._targets && node.hiddenByFilters === false) {
    const links = <Link[]>linkMapWithSourcesAsKey[node.id];
    const comparators = getComparators(filter._targets);
    if (links) {
      links.forEach(link => {
        compareNodeToFilter(filter._targets, link.target as D3Node, comparators, linkMapWithSourcesAsKey);
      });
    }
  }

}

function getComparators(filter: Filter): [Function, object] {
  const typeComparator = filterType(filter.type) ? operator : defaultEquals;
  const attributeComparatorMap = filter.attribute ? Object.keys(filter.attribute).reduce((object, key) => {
    object[key] = Array.isArray(filter.attribute[key]) ? operator : defaultEquals;
    return object;
  }, {}) : () => undefined;
  return [typeComparator, attributeComparatorMap];
}

function alreadyFailed(object: { [key: string]: boolean }) {
  return Reflect.ownKeys(object).some(key => object[key] === false);
}

function filterType(filterEntry: string[] | string): filterEntry is string[] {
  return Array.isArray(filterEntry);
};

function operator (left, [operator, right]): boolean {
  switch (operator) {
    case '===': return left === right;
    case '!==': return left !== right;
    case '>': return left > right;
    case '>=': return left >= right;
    case '<': return left < right;
    case '<=': return left <= right;
  }
}

function defaultEquals(left, right) {
  return left === right;
}
