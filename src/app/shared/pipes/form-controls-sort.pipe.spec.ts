import { FormGroup, FormControl } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';

import { FormControlsSortPipe } from './form-controls-sort.pipe';

describe('FormControlsSortPipe', () => {
  it('create an instance', () => {
    const pipe = new FormControlsSortPipe();
    expect(pipe).toBeTruthy();
  });

  it('sorts the form group array ascending', () => {
    const fg1 = new FormGroup({ name: new FormControl('mno') });
    const fg2 = new FormGroup({ name: new FormControl('abc') });
    const fg3 = new FormGroup({ name: new FormControl('xyz') });
    const fg4 = new FormGroup({ name: new FormControl('mno') });
    const pipe = new FormControlsSortPipe();
    const sorted = pipe.transform([fg1, fg2, fg3, fg4], 'name', true).map(fg => fg.value.name);
    expect(sorted).toEqual(['abc', 'mno', 'mno', 'xyz']);
  });

  it('sorts the form group array descending', () => {
    const fg1 = new FormGroup({ name: new FormControl('mno') });
    const fg2 = new FormGroup({ name: new FormControl('abc') });
    const fg3 = new FormGroup({ name: new FormControl('xyz') });
    const fg4 = new FormGroup({ name: new FormControl('mno') });
    const pipe = new FormControlsSortPipe();
    const sorted = pipe.transform([fg1, fg2, fg3, fg4], 'name', false).map(fg => fg.value.name);
    expect(sorted).toEqual(['xyz', 'mno', 'mno', 'abc']);
  });
});
