import { Pipe, PipeTransform } from '@angular/core';

import { D3Node } from '../../../non-angular/interfaces';

@Pipe({
  name: 'objectSort'
})
export class ObjectSortPipe implements PipeTransform {

  transform(array: any[], keyToSortOn: string, ascending: boolean): any[] {
    return array.sort(sort(ascending, keyToSortOn));
  }
}

function sort(ascending: boolean, keyToSortOn: string) {
  return function(first: any, second: any): number {
    const type = typeof first[keyToSortOn];
    if (first[keyToSortOn] && second[keyToSortOn]) {
      if (type === 'string') {
        const firstString = (first[keyToSortOn] as string).toLowerCase();
        const secondString = (second[keyToSortOn] as string).toLowerCase();
        if (firstString < secondString) {
          return ascending ? -1 : 1;
        } else if (firstString > secondString) {
          return ascending ? 1 : -1;
        }
        return 0;
      } else if (type === 'number') {
        const firstNumber = first[keyToSortOn] as number;
        const secondNumber = second[keyToSortOn] as number;
        if (firstNumber < secondNumber) {
          return ascending ? -1 : 1;
        } else if (firstNumber > secondNumber) {
          return ascending ? 1 : -1;
        }
        return 0;
      } else {
        return 0;
      }
    } else if (!first[keyToSortOn] && second[keyToSortOn]) {
      return 1;
    } else if (first[keyToSortOn] && !second[keyToSortOn]) {
      return -1;
    } else {
      return 0;
    }
  }
}
