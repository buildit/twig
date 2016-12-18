import { Pipe, PipeTransform } from '@angular/core';
import { Map } from 'immutable';

@Pipe({
  name: 'immutableMapOfMaps'
})
export class ImmutableMapOfMapsPipe implements PipeTransform {

  transform(map: Map<string, Map<string, any>>, args?: any): any {
    return map.reduce((array, m) => {
      array.push(m.toJS());
      return array;
    }, []);
  }

}
