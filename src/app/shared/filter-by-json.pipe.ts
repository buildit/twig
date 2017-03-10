import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByJson'
})
export class FilterByJsonPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
