/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ObjectSortPipe } from './object-sort.pipe';

describe('ObjectSortPipe', () => {
  const nodes = [
    {id: '1stNode', name: 'fIrStNode', attrs: [], x: 100},
    {id: '2ndNode', random_key: 'a key', attrs: [], x: 50},
    {id: '3rdNode', attrs: [{key: 'some key', value: 'third not first'}], x: 75},
  ];

  it('create an instance', () => {
    let pipe = new ObjectSortPipe();
    expect(pipe).toBeTruthy();
  });

  it('can sort ascending by a key that contains strings.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'id', true);
    expect(sorted[0].id).toEqual('1stNode');
    expect(sorted[2].id).toEqual('3rdNode');
  });

  it('can sort descending by a key that contains strings.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'id', false);
    expect(sorted[0].id).toEqual('3rdNode');
    expect(sorted[2].id).toEqual('1stNode');
  });

  it('can sort ascending by a key that contains numbers.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'x', true);
    expect(sorted[0].id).toEqual('2ndNode');
    expect(sorted[2].id).toEqual('1stNode');
  });

  it('can sort descending by a key that contains numbers.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'x', false);
    expect(sorted[0].id).toEqual('1stNode');
    expect(sorted[2].id).toEqual('2ndNode');
  });

});
