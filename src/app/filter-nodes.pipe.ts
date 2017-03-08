import { Pipe, PipeTransform } from '@angular/core';
import { Map, List } from 'immutable';

import { D3Node } from '../non-angular/interfaces';

@Pipe({
  name: 'filterNodes'
})
export class FilterNodesPipe implements PipeTransform {

  transform(d3Nodes: D3Node[], filters: Map<string, any>): D3Node[] {
    const types = filters.get('types') as Map<string, boolean>;
    const activeTypes = types.filter((value, key) => value);
    const attributes = filters.get('attributes') as List<Map<string, any>>;
    const activeAttributes = attributes.filter(value => value.get('active'));
    if (activeAttributes.size || activeTypes.size) {
      return d3Nodes.filter((d3Node: D3Node) => {
        if (activeTypes.size && !activeTypes.get(d3Node.type)) {
          return false;
        }
        if (activeAttributes.size) {
          return activeAttributes.every(filterAttribute =>
            d3Node.attrs.some(nodeAttribute =>
              filterAttribute.get('key') === nodeAttribute.key && filterAttribute.get('value') === nodeAttribute.value
            )
          );
        }
        return true;
      });
    } else {
      return d3Nodes;
    }
  }
}
