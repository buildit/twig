import { Pipe, PipeTransform } from '@angular/core';

import { D3Node } from '../../../non-angular/interfaces';

@Pipe({
  name: 'nodeSearch'
})
export class NodeSearchPipe implements PipeTransform {
  transform(d3Nodes: D3Node[], textToFilterOn: string): D3Node[] {
    if (textToFilterOn) {
      return d3Nodes.filter(d3Node => {
        const lowerCase = textToFilterOn.toLowerCase();
        return Object.keys(d3Node).some(key => {
          return typeof d3Node[key] === 'string' && d3Node[key].toLowerCase().indexOf(lowerCase) !== -1;
        }) || d3Node.attrs.some(attr => {
          return attr.value.toLowerCase().indexOf(lowerCase) !== -1;
        });
      });
    } else {
      return d3Nodes;
    }
  }
}
