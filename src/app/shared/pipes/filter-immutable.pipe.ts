import { Pipe, PipeTransform } from '@angular/core';
import { Iterable, Map } from 'immutable';

@Pipe({
  name: 'filterImmutable'
})
export class FilterImmutablePipe implements PipeTransform {

  transform(it: Iterable<number, Map<string, string>>, key: string, value: string): Iterable<number, Map<string, any>> {
    if (value === null) {
      return it;
    }
    return it.filter(s => s.get(key).includes(value.toLowerCase()));
  }

}
