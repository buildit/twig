import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValues'
})
export class KeyValuesPipe implements PipeTransform {

  transform(value: Object, args?: any): Object[] {
    const returner = [];
    Object.keys(value).forEach(key => {
      const tempObject: { key: string, value: any } = {
        key,
        value: value[key],
      };
      returner.push(tempObject);
    });
    return returner;
  }
}
