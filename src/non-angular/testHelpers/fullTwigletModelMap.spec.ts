import { fromJS } from 'immutable';
export function fullTwigletModelMap() {
  return fromJS({
    _rev: 'some revision number',
    entities: {
      ent1: {
        attributes: [
          {
            dataType: 'string',
            name: 'keyOne',
            required: true
          },
          {
            dataType: 'string',
            name: 'keyExtra',
            required: false
          }
        ],
        class: 'bang',
        color: '#bada55',
        image: '!',
        size: 40,
        type: 'ent1',
      },
      ent2: {
        attributes: [],
        class: 'at',
        color: '#4286f4',
        image: '@',
        size: 40,
        type: 'ent2',
      },
      ent3: {
        attributes: [],
        class: 'hashtag',
        color: '#d142f4',
        image: '#',
        size: 40,
        type: 'ent3',
      },
      ent4: {
        attributes: [],
        class: 'hashtag',
        color: '#9542f4',
        image: '$',
        size: 40,
        type: 'ent4',
      },
      ent4ext: {
        attributes: [],
        class: 'hashtag',
        color: '#000000',
        image: '%',
        size: 50,
        type: 'ent4ext',
      },
      ent5: {
        attributes: [],
        class: 'hashtag',
        color: '#f4424b',
        image: '%',
        size: 40,
        type: 'ent5',
      },
    },
  });
}
