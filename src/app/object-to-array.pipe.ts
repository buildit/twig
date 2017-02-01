import { Map } from 'immutable';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray'
})
export class ObjectToArrayPipe implements PipeTransform {

  transform(value: Map<string, any>): any {
    return value.toArray().map(map => map.toJS());
  }

}
