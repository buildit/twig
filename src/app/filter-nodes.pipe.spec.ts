import { TestBed, async } from '@angular/core/testing';
import { fromJS } from 'immutable';

import { FilterNodesPipe } from './filter-nodes.pipe';

const nodes = [
  {
    attrs: [{ key: 'color', value: 'green' }, { key: 'number', value: '1' }],
    id: 'node1',
    type: 'type1'
  },
  {
    attrs: [{ key: 'color', value: 'red' }, { key: 'number', value: '1' }, { key: 'number', value: '2' }],
    id: 'node2',
    type: 'type2',
  },
  {
    attrs: [{ key: 'color', value: 'green' }, { key: 'number', value: '2' }],
    id: 'node3',
    type: 'type3'
  },
  {
    attrs: [{ key: 'color', value: 'purple' }, { key: 'number', value: '3' }],
    id: 'node4',
    type: 'type3',
  }
];

describe('FilterNodesPipe', () => {
  let pipe: FilterNodesPipe;

  beforeEach(() => {
    pipe = new FilterNodesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns everything if there are no filters', () => {
    const filters = fromJS({ attributes: [], types: {} });
    expect(pipe.transform(nodes, filters)).toEqual(nodes);
  });

  it('can filter out by a single type', () => {
    const filters = fromJS({ attributes: [], types: { type3: true} });
    expect(pipe.transform(nodes, filters).length).toEqual(2);
  });

  it('does not apply type filter if the filter is inactive', () => {
    const filters = fromJS({ attributes: [], types: { type3: false } });
    expect(pipe.transform(nodes, filters).length).toEqual(4);
  });

  it('can filter out by multiple types', () => {
    const filters = fromJS({ attributes: [], types: { type1: true, type3: true } });
    expect(pipe.transform(nodes, filters).length).toEqual(3);
  });

  it('can filter out by a key value pair', () => {
    const filters = fromJS({ attributes: [ { key: 'color', value: 'red', active: true }], types: { } });
    expect(pipe.transform(nodes, filters).length).toEqual(1);
  });

  it('ignores key value pairs if the pair is inactive', () => {
    const filters = fromJS({ attributes: [ { key: 'color', value: 'red', active: false }], types: { } });
    expect(pipe.transform(nodes, filters).length).toEqual(4);
  });

  it('can filter by multiple key value pairs', () => {
    const filters = fromJS({
      attributes: [
        { key: 'color', value: 'green', active: true },
        { key: 'number', value: '1', active: true },
      ],
      types: { }
    });
    expect(pipe.transform(nodes, filters).length).toEqual(1);
  });

  it('can filter a mix of types and key value pairs', () => {
    const filters = fromJS({ attributes: [ { key: 'color', value: 'purple', active: true }], types: { type3: true } });
    expect(pipe.transform(nodes, filters).length).toEqual(1);
  });
});
