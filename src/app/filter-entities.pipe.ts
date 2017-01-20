import { Pipe, PipeTransform } from '@angular/core';
import { D3Node } from '../non-angular/interfaces';

@Pipe({
  name: 'filterEntities'
})
export class FilterEntitiesPipe implements PipeTransform {

  transform(d3Nodes: D3Node[], arrayToShow: String[]): D3Node[] {
    if (arrayToShow.length > 0) {
      return d3Nodes.filter(d3Node => {
        for (let i = 0; i < arrayToShow.length; i++) {
          if (d3Node.type === arrayToShow[i]) {
            return d3Node;
          }
        }
      });
    } else {
      return d3Nodes;
    }
  }

}
