import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'formControlsSort'
})
export class FormControlsSortPipe implements PipeTransform {

  transform(controls: FormGroup[], keyToSortOn: string, ascending: boolean): FormGroup[] {
    return controls.sort((a, b) => {
      return ascending ? sort(a, b, keyToSortOn) : sort (b, a, keyToSortOn);
    });
  }
}

function sort (first: FormGroup, second: FormGroup, keyToSortOn: string): number {
  const firstString = (first.controls[keyToSortOn].value).toLowerCase();
  const secondString = (second.controls[keyToSortOn].value).toLowerCase();
  if (firstString < secondString) {
    return -1;
  } else if (firstString > secondString) {
    return 1;
  }
  return 0;

}
