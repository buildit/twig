import { fromJS, List, Map } from 'immutable';
import { D3Node } from './../../non-angular/interfaces/twiglet/node';
import { FilterByObjectPipe } from './filter-by-object.pipe';

describe('FilterByObjectPipe', () => {
  let pipe: FilterByObjectPipe;
  let nodes: D3Node[];
  let links: Map<string, Map<string, any>>;

  beforeEach(() => {
    pipe = new FilterByObjectPipe();
    nodes = [
      { id: 'nId1', type: 'ent1', attrs: [ { key: 'key1', value: 'match1' } ] },
      { id: 'nId2', type: 'ent1', attrs: [ ] },
      { id: 'nId3', type: 'ent2', attrs: [ { key: 'key1', value: 'match1' } ] },
      { id: 'nId4', type: 'ent2', attrs: [ ] },
      ];
    links = fromJS({
      lId1: {
        source: 'nId1',
        target: 'nId2'
      },
      lId2: {
        source: 'nId1',
        target: 'nId3'
      },
      lId3: {
        source: 'nId4',
        target: 'nId1'
      }
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns all of the nodes if the filters are blank', () => {
    expect(pipe.transform(nodes, fromJS({}), List([])).length).toEqual(4);
  });

  describe('single level matching', () => {
    it('can match types', () => {
      const filter = fromJS([ { type: 'ent1' }]);
      expect(pipe.transform(nodes, fromJS({}), filter).length).toEqual(2);
    });

    it('can match by attributes', () => {
      const filter = fromJS([ { attributes: [ { key: 'key1', value: 'match1' } ] } ]);
      expect(pipe.transform(nodes, fromJS({}), filter).length).toEqual(2);
    });

    it('can match both types and filters', () => {
      const filter = fromJS([ { type: 'ent1', attributes: [ { key: 'key1', value: 'match1' } ] } ]);
      expect(pipe.transform(nodes, fromJS({}), filter).length).toEqual(1);
    });
  });

  describe('multi-level matching', () => {
    it('can match child nodes using a different filter', () => {
      const filter = fromJS([ { type: 'ent1', _target: { type: 'ent2' } } ]);
      expect(pipe.transform(nodes, links, filter).length).toEqual(3);
    });
  });
});
