/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { PrimitiveArraySortPipe } from './primitive-array-sort.pipe';

describe('ArraySortPipe', () => {
  it('create an instance', () => {
    const pipe = new PrimitiveArraySortPipe();
    expect(pipe).toBeTruthy();
  });

  describe('basics', () => {
    it('defaults to ascending order', () => {
      const pipe = new PrimitiveArraySortPipe();
      expect(pipe.transform([1, 3, 2])).toEqual([1, 2, 3]);
    });

    it('can sort descending', () => {
      const pipe = new PrimitiveArraySortPipe();
      expect(pipe.transform([1, 3, 2], true)).toEqual([3, 2, 1]);
    });
  });

  describe('strings', () => {
    it('ignores case on string values', () => {
      const pipe = new PrimitiveArraySortPipe();
      expect(pipe.transform(['a', 'c', 'B'])).toEqual(['a', 'B', 'c']);
    });

    it('correctly sorts mixed arrays', () => {
      const pipe = new PrimitiveArraySortPipe();
      expect(pipe.transform(['a', 3, 'B'])).toEqual([3, 'a', 'B']);
    });
  });
});
