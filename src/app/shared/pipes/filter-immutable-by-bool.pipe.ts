import { Pipe, PipeTransform } from '@angular/core';
import { Iterable, Map } from 'immutable';

@Pipe({
  name: 'filterImmutableByBool',
  pure: false,
})
export class FilterImmutableByBoolPipe implements PipeTransform {

  transform(it: Iterable<number, Map<any, any>>, key: any, value: boolean): Iterable<number, Map<any, any>> {
    if (value) {
      return it.filter(s => s.get(key))
    }
    if (!value) {
      return it.filterNot(s => s.get(key));
    }
  }

}
