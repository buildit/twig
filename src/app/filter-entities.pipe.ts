import { Pipe, PipeTransform } from '@angular/core';
import { D3Node } from '../non-angular/interfaces';

@Pipe({
  name: 'filterEntities'
})
export class FilterEntitiesPipe implements PipeTransform {

  transform(d3Nodes: D3Node[], entitiesToShow: Array<string>): D3Node[] {
    if (entitiesToShow.length > 0) {
      console.log('Entities to filter yo');
      return d3Nodes;
    }
    return d3Nodes;
  }

}
