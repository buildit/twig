import { Pipe, PipeTransform } from '@angular/core';
import { List } from 'immutable';

@Pipe({
  name: 'sortImmutable'
})
export class SortImmutablePipe implements PipeTransform {

  transform(list: List<any>, key: any, ascending = true): any {
    return list.sortBy(value => value.get(key));
  }

}
