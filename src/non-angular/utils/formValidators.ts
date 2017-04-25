import { ValidatorFn, AsyncValidatorFn, Validators as V, FormControl } from '@angular/forms';
import * as moment from 'moment';

// the need in this validators is the non-trimming angular standard behavior
// see https://github.com/angular/angular/issues/8503
export class CustomValidators {

  public static integer(control: FormControl) {
    if (!control.value) {
      return;
    }
    if (isNaN(control.value) || parseInt(<any>Number(control.value), 10).toString() !== control.value
        || isNaN(parseInt(control.value, 10))) {
      return {
        integer: true
      };
    }
    return null;
  }

  public static float(control: FormControl) {
    if (!control.value) {
      return;
    }
    if (isNaN(control.value)) {
      return {
        float: true,
      };
    }
    return null;
  }

  public static timestamp (control: FormControl) {
    if (!control.value) {
      return;
    }
    if (!moment(control.value).isValid()) {
      return {
        timestamp: true,
      };
    }
    return null;
  }
};
