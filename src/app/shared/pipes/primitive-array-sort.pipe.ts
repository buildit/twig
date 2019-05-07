import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primitiveArraySort'
})
export class PrimitiveArraySortPipe implements PipeTransform {

  transform(array: any[], descending?: boolean): any {
    const transformation = descending ? -1 : 1;

    // separate the numbers and strings
    const numbers = array.filter(item => typeof(item) === 'number');
    const strings = array.filter(item => typeof(item) === 'string');

    // sort each array separately
    numbers.sort((a, b) => (a - b) * transformation);
    strings.sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 * transformation : transformation;
    });

    // concatenate the arrays and return the result
    const sorted = descending ? [...strings, ...numbers] : [...numbers, ...strings];
    return sorted;
  }
}
