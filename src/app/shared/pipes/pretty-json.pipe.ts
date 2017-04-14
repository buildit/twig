import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson'
})
export class PrettyJsonPipe implements PipeTransform {

  transform(value: string): any {
    try {
      return JSON.stringify(JSON.parse(value), undefined, 4);
    } catch (error) {
      return value;
    }
  }
}
