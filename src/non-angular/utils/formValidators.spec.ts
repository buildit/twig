import { FormControl } from '@angular/forms';
import { CustomValidators } from './formValidators';
import * as moment from 'moment';

describe('formValidators', () => {
  describe('integer', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(CustomValidators.integer(control)).toBe(null);
    });

    it('allows integers', () => {
      const control = new FormControl(2);
      expect(CustomValidators.integer(control)).toBe(null);
    });

    it('fails decimals', () => {
      const control = new FormControl(2.5);
      expect(CustomValidators.integer(control)).not.toBe(null);
    });

    it('fails strings', () => {
      const control = new FormControl('a');
      expect(CustomValidators.integer(control)).not.toBe(null);
    });

    it('fails number-likes', () => {
      const control = new FormControl('1.0.2');
      expect(CustomValidators.integer(control)).not.toBe(null);
    });
  });

  describe('number', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(CustomValidators.float(control)).toBe(null);
    });

    it('allows integers', () => {
      const control = new FormControl(2);
      expect(CustomValidators.float(control)).toBe(null);
    });

    it('allows decimals', () => {
      const control = new FormControl(2.5);
      expect(CustomValidators.float(control)).toBe(null);
    });

    it('fails strings', () => {
      const control = new FormControl('a');
      expect(CustomValidators.float(control)).not.toBe(null);
    });

    it('fails number-likes', () => {
      const control = new FormControl('1.0.2');
      expect(CustomValidators.float(control)).not.toBe(null);
    });
  });

  describe('date', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(CustomValidators.timestamp(control)).toBe(null);
    });

    it('fails if moment validation fails', () => {
      spyOn(moment.prototype, 'isValid').and.returnValue(false);
      const control = new FormControl('2017-04-17');
      expect(CustomValidators.timestamp(control)).toEqual({
        timestamp: true,
      });
    });

    it('passes if moment validation passes', () => {
      spyOn(moment.prototype, 'isValid').and.returnValue(true);
      const control = new FormControl('2017-04-17');
      CustomValidators.timestamp(control);
      expect(CustomValidators.timestamp(control)).toBeNull();
    });
  });
});
