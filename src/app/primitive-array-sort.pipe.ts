import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primitiveArraySort'
})
export class PrimitiveArraySortPipe implements PipeTransform {

  transform(array: any[], descending?: boolean): any {
    const transformation = descending ? -1 : 1;
    return array.sort((a, b) => {
      const first = typeof a === 'string' ? a.toLowerCase() : a;
      const second = typeof b === 'string' ? b.toLowerCase() : b;
      return first < second ? -1 * transformation : transformation;
    });
  }
}
