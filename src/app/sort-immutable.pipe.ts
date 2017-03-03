import { List } from 'immutable';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortImmutable'
})
export class SortImmutablePipe implements PipeTransform {

  transform(list: List<any>, key: any, ascending = true): any {
    return list.sortBy(value => value.get(key));
  }

}
