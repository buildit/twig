/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { NodeSearchPipe } from './node-search.pipe';

describe('NodeSearchPipe', () => {
  const nodes = [
    {id: '1stNode', name: 'fIrStNode', attrs: []},
    {id: '2ndNode', random_key: 'a key', attrs: []},
    {id: '3rdNode', attrs: [{key: 'some key', value: 'third not first'}], },
  ];
  it('create an instance', () => {
    const pipe = new NodeSearchPipe();
    expect(pipe).toBeTruthy();
  });

  it('filters out nodes that match the search terms', () => {
    const result = new NodeSearchPipe().transform(nodes, 'first');
    expect(result.length).toEqual(2);
  });

  it('returns everything if there is no search term', () => {
    const result = new NodeSearchPipe().transform(nodes, null);
    expect(result.length).toEqual(3);
  });
});
