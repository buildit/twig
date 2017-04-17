import { Pipe, PipeTransform } from '@angular/core';
import { Map } from 'immutable';

@Pipe({
  name: 'objectToArray'
})
export class ObjectToArrayPipe implements PipeTransform {

  transform(value: Map<string, any>): any {
    return value.toArray().map(map => map.toJS());
  }

}
