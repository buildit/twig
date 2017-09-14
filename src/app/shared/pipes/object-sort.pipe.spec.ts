import { TestBed, async } from '@angular/core/testing';
import { clone } from 'ramda';

import { ObjectSortPipe } from './object-sort.pipe';

describe('ObjectSortPipe', () => {
  const nodes = [
    {id: 'mnoNode', name: 'fIrStNode', attrs: [], x: 50},
    {id: 'abcNode', random_key: 'a key', attrs: [], x: 100},
    {id: 'xyzNode', attrs: [{key: 'some key', value: 'third not first'}], x: 75},
    {id: 'mnoNode', z: 75},
    { x: 75 },
    { y: 100 },
  ];

  it('create an instance', () => {
    const pipe = new ObjectSortPipe();
    expect(pipe).toBeTruthy();
  });

  it('can sort ascending by a key that contains strings.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'id', true);
    expect(sorted[0].id).toEqual('abcNode');
    expect(sorted[3].id).toEqual('xyzNode');
  });

  it('can sort descending by a key that contains strings.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'id', false);
    expect(sorted[0].id).toEqual('xyzNode');
    expect(sorted[3].id).toEqual('abcNode');
  });

  it('can sort ascending by a key that contains numbers.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'x', true);
    expect(sorted[0].id).toEqual('mnoNode');
    expect(sorted[3].id).toEqual('abcNode');
  });

  it('can sort descending by a key that contains numbers.', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'x', false);
    expect(sorted[0].id).toEqual('abcNode');
    expect(sorted[3].id).toEqual('mnoNode');
  });

  it('leaves does no real sorted if not a string or number', () => {
    const sorted = new ObjectSortPipe().transform(nodes, 'attrs', true);
    expect(sorted[0].id).toEqual('abcNode');
  });

});
