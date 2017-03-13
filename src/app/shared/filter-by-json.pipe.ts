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
    const nodesAsObjects = d3Nodes.reduce((object, d3Node)   => {
      d3Node.hiddenByFilters = true;
      object[d3Node.id] = d3Node;
      return object;
    }, {});
    const linkMapWithSourcesAsKey = links.reduce((object, link, id) => {
      const linkAsJS = <Link>link.toJS();
      linkAsJS.source = nodesAsObjects[linkAsJS.source as string];
      linkAsJS.target = nodesAsObjects[linkAsJS.target as string];
      if (object[id]) {
        object[id].push(linkAsJS);
      } else {
        object[id] = [linkAsJS];
      }
      return object;
    }, {});
    const filters = JSON.parse(filterAsJSON) as Filter[];
    filters.forEach(filter => {
      d3Nodes.forEach(node => compareNodeToFilter(filter, node, getComparators(filter), linkMapWithSourcesAsKey));
    });
  }
}

function compareNodeToFilter(filter: Filter, node: D3Node, [typeComparator, attributeComparatorMap], linkMapWithSourcesAsKey) {
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
      .every(key => attributeComparatorMap[key](node.attrs[key], filter.attribute[key]));
  }
  if (!alreadyFailed(match)) {
    node.hiddenByFilters = false;
  }
  if (filter._targets) {
    const links = <Link[]>linkMapWithSourcesAsKey[node.id];
    // links.forEach()s
  }

}

function getComparators(filter: Filter): [Function, object] {
  const typeComparator = filterType(filter.type) ? operator : defaultEquals;
  const attributeComparatorMap = Object.keys(filter.attribute).reduce((object, key) => {
    object[key] = Array.isArray(filter.attribute[key]) ? operator : defaultEquals;
    return object;
  }, {});
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
