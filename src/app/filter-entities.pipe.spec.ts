/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FilterEntitiesPipe } from './filter-entities.pipe';

fdescribe('FilterEntitiesPipe', () => {
  const nodes = [
    {id: '1stNode', name: 'fIrStNode', type: 'sometype', attrs: []},
    {id: '2ndNode', type: 'anothertype', attrs: []},
    {id: '3rdNode', type: 'sometype', attrs: [], },
  ];

  it('create an instance', () => {
    let pipe = new FilterEntitiesPipe();
    expect(pipe).toBeTruthy();
  });

  it('filters out nodes that match the filtered type', () => {
    const result = new FilterEntitiesPipe().transform(nodes, ['sometype']);
    expect(result.length).toEqual(2);
  });

  it('returns everything if there are no filtered types', () => {
    const result = new FilterEntitiesPipe().transform(nodes, []);
    expect(result.length).toEqual(3);
  });
});
