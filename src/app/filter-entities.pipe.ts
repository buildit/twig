import { Pipe, PipeTransform } from '@angular/core';
import { D3Node } from '../non-angular/interfaces';

@Pipe({
  name: 'filterEntities'
})
export class FilterEntitiesPipe implements PipeTransform {

  transform(d3Nodes: D3Node[], entitiesToShow: String[]): D3Node[] {
    if (entitiesToShow.length > 0) {
      return d3Nodes.filter(d3Node => {
        for (let i = 0; i < entitiesToShow.length; i++) {
          if (d3Node.type === entitiesToShow[i]) {
            return d3Node;
          }
        }
      });
    } else {
      return d3Nodes;
    }
  }

}
