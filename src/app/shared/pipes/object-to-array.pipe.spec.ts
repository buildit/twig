import { Map } from 'immutable';
import { TestBed, async } from '@angular/core/testing';

import { ObjectToArrayPipe } from './object-to-array.pipe';

describe('ObjectToArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new ObjectToArrayPipe();
    expect(pipe).toBeTruthy();
  });

  it('turns a map into an array of values', () => {
    const map = Map({
      key1: Map({ name: 1 }),
      key2: Map({ name: 2 }),
      key3: Map({ name: 3 }),
    });
    const expected = [
      { name: 1 },
      { name: 2 },
      { name: 3 },
    ]
    const transformed = new ObjectToArrayPipe().transform(map);
    expect(transformed).toEqual(expected);
  })
});
