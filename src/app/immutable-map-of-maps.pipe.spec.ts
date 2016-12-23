/* tslint:disable:no-unused-variable */

import { fromJS, Map } from 'immutable';

import { TestBed, async } from '@angular/core/testing';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';

describe('ImmutableMapOfMapsPipe', () => {
  it('create an instance', () => {
    const pipe = new ImmutableMapOfMapsPipe();
    expect(pipe).toBeTruthy();
  });

  it('converts a map of maps to an array', () => {
    // Setup
    const maps = fromJS({
      firstNode: {
        id: 'firstNode',
        name: 'firstNodeName',
        type: '@',
        x: 100,
        y: 100,
      },
      secondNode: {
        id: 'secondNode',
        name: 'secondNodeName',
        type: '#',
        x: 200,
        y: 300,
      },
      thirdNode: {
        id: 'thirdNode',
        name: 'thirdNodeName',
        type: '$',
      }
    });
    const expected = [
      {
        id: 'firstNode',
        name: 'firstNodeName',
        type: '@',
        x: 100,
        y: 100,
      },
      {
        id: 'secondNode',
        name: 'secondNodeName',
        type: '#',
        x: 200,
        y: 300,
      },
      {
        id: 'thirdNode',
        name: 'thirdNodeName',
        type: '$',
      }
    ];
    const pipe = new ImmutableMapOfMapsPipe();
    expect(pipe.transform(maps)).toEqual(expected);
  });
});
