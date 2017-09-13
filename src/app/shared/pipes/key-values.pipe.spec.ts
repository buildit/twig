import { TestBed, async } from '@angular/core/testing';

import { KeyValuesPipe } from './key-values.pipe';

describe('KeyValuesPipe', () => {
  it('create an instance', () => {
    const pipe = new KeyValuesPipe();
    expect(pipe).toBeTruthy();
  });

  it('turns an object into an array of key/value objects', () => {
    const input = {
      key1: 'value1',
      key2: 10,
      key3: true,
    }
    const expectedOutput = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 10 },
      { key: 'key3', value: true },
    ];
    const pipe = new KeyValuesPipe();
    const output = pipe.transform(input);
    expect(output).toEqual(expectedOutput);
  });
});
