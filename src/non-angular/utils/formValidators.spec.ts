import { FormControl } from '@angular/forms';
import { Validators } from './formValidators';
import * as moment from 'moment';

describe('formValidators', () => {
  describe('integer', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(Validators.integer(control)).toBe(null);
    });

    it('allows integers', () => {
      const control = new FormControl(2);
      expect(Validators.integer(control)).toBe(null);
    });

    it('fails decimals', () => {
      const control = new FormControl(2.5);
      expect(Validators.integer(control)).not.toBe(null);
    });

    it('fails strings', () => {
      const control = new FormControl('a');
      expect(Validators.integer(control)).not.toBe(null);
    });

    it('fails number-likes', () => {
      const control = new FormControl('1.0.2');
      expect(Validators.integer(control)).not.toBe(null);
    });
  });

  describe('number', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(Validators.number(control)).toBe(null);
    });

    it('allows integers', () => {
      const control = new FormControl(2);
      expect(Validators.number(control)).toBe(null);
    });

    it('allows decimals', () => {
      const control = new FormControl(2.5);
      expect(Validators.number(control)).toBe(null);
    });

    it('fails strings', () => {
      const control = new FormControl('a');
      expect(Validators.number(control)).not.toBe(null);
    });

    it('fails number-likes', () => {
      const control = new FormControl('1.0.2');
      expect(Validators.number(control)).not.toBe(null);
    });
  });

  describe('date', () => {
    it('allows empty controls', () => {
      const control = new FormControl();
      expect(Validators.number(control)).toBe(null);
    });

    it('uses the moment library to determine valid dates', () => {
      spyOn(moment.prototype, 'isValid');
      const control = new FormControl('2017-04-17');
      Validators.date(control);
      expect(moment.prototype.isValid).toHaveBeenCalled();
    });
  });
});
