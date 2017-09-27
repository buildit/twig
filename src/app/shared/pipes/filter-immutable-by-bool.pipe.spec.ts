import { fromJS } from 'immutable';

import { FilterImmutableByBoolPipe } from './filter-immutable-by-bool.pipe';

describe('FilterImmutableByBoolPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterImmutableByBoolPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns the filtered set of immutables if boolean is true', () => {
    const unfiltered = fromJS([{ checked: true}, { checked: true }, { checked: false }]);
    const pipe = new FilterImmutableByBoolPipe();
    const filtered = pipe.transform(unfiltered, 'checked', true);
    expect(filtered.size).toEqual(2);
  });

  it('returns the filtered set of immutables if boolean is false', () => {
    const unfiltered = fromJS([{ checked: true}, { checked: true }, { checked: false }]);
    const pipe = new FilterImmutableByBoolPipe();
    const filtered = pipe.transform(unfiltered, 'checked', false);
    expect(filtered.size).toEqual(1);
  });
});
