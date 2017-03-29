import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'withParent',
  pure: false
})
export class WithParentPipe implements PipeTransform {

  transform(value: Array<any>, args: any[] = null): any {
    console.log(value);
    return value.map(t => {
      return {
        item: t,
        parent: value
      };
    });
  }

}
