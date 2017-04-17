import { Pipe, PipeTransform } from '@angular/core';

import { D3Node } from '../../../non-angular/interfaces';

@Pipe({
  name: 'objectSort'
})
export class ObjectSortPipe implements PipeTransform {

  transform(array: any[], keyToSortOn: string, ascending: boolean): any[] {
    return array.sort((a, b) => {
      return ascending ? sort(a, b, keyToSortOn) : sort (b, a, keyToSortOn);
    });
  }
}

function sort (first: any, second: any, keyToSortOn: string): number {
  const type = typeof first[keyToSortOn];
  if (type === 'string') {
    if (first[keyToSortOn] && second[keyToSortOn]) {
      const firstString = (first[keyToSortOn] as string).toLowerCase();
      const secondString = (second[keyToSortOn] as string).toLowerCase();
      if (firstString < secondString) {
        return -1;
      } else if (firstString > secondString) {
        return 1;
      }
      return 0;
    }
  } else if (type === 'number') {
    const firstNumber = first[keyToSortOn] as number;
    const secondNumber = second[keyToSortOn] as number;
    if (firstNumber < secondNumber) {
      return -1;
    } else if (firstNumber > secondNumber) {
      return 1;
    }
    return 0;
  }
}
