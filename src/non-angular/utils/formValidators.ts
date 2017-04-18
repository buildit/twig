import { ValidatorFn, AsyncValidatorFn, Validators as V, FormControl } from '@angular/forms';
import * as moment from 'moment';

// the need in this validators is the non-trimming angular standard behavior
// see https://github.com/angular/angular/issues/8503
export class Validators {

  public static integer(control: FormControl) {
    if (control.value && (isNaN(control.value) || parseInt(<any>Number(control.value), 10) !== control.value
        || isNaN(parseInt(control.value, 10)))) {
      return {
        integer: true
      };
    }
    return null;
  }

  public static number(control: FormControl) {
    if (control.value && isNaN(control.value)) {
      return {
        number: true,
      };
    }
    return null;
  }

  public static date(control: FormControl) {
    if (control.value && !moment(control.value).isValid()) {
      return {
        datetime: true,
      };
    }
    return null;
  }
};
