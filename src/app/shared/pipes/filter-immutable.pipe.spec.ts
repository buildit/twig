import { FilterImmutablePipe } from './filter-immutable.pipe';
import { fromJS } from 'immutable';

describe('FilterImmutablePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterImmutablePipe();
    expect(pipe).toBeTruthy();
  });

  it('returns the filtered set of immutables', () => {
    const unfiltered = fromJS([{ name: 'ok1'}, { name: 'ok2' }, { name: 'bad' }]);
    const pipe = new FilterImmutablePipe();
    const filtered = pipe.transform(unfiltered, 'name', 'ok');
    expect(filtered.size).toEqual(2);
  });

  it('returns the original set if value is null', () => {
    const unfiltered = fromJS([{ name: 'ok1'}, { name: 'ok2' }, { name: 'bad' }]);
    const pipe = new FilterImmutablePipe();
    const filtered = pipe.transform(unfiltered, 'name', null);
    expect(filtered).toBe(unfiltered);
  });
});
