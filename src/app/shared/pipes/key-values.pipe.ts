import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValues'
})
export class KeyValuesPipe implements PipeTransform {

  transform(object: Object): Object[] {
    const returner = [];
    Object.keys(object).forEach(key => {
      const tempObject: { key: string, value: any } = {
        key,
        value: object[key],
      };
      returner.push(tempObject);
    });
    return returner;
  }
}
