import { fromJS } from 'immutable';
export function fullModelMap() {
  return fromJS({
    _rev: 'some revision number',
    changelog_url: 'http://localhost:3000/models/some%20name/changelog',
    entities: {
      ent1: {
        class: 'bang',
        color: '#bada55',
        image: '!',
        size: 40,
        type: 'ent1',
      },
      ent2: {
        class: 'at',
        color: '#4286f4',
        image: '@',
        size: 40,
        type: 'ent2',
      },
      ent3: {
        class: 'hashtag',
        color: '#d142f4',
        image: '#',
        size: 40,
        type: 'ent3',
      },
      ent4: {
        class: 'hashtag',
        color: '#9542f4',
        image: '$',
        size: 40,
        type: 'ent4',
      },
      ent5: {
        class: 'hashtag',
        color: '#f4424b',
        image: '%',
        size: 40,
        type: 'ent5',
      },
    },
    name: 'model name',
    url: 'http://localhost:3000/models/some%20name',
  });
}
