import { fromJS, Map } from 'immutable';
export function fullTwigletMap (): Map<string, any> {
  return fromJS({
    _rev: 'rev1',
    changelog_url: '/twiglets/name1/changelog',
    commitMessage: 'The latest commit',
    description: 'a description',
    links: {
      firstLink: {
        association: 'firstLink',
        attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
        id: 'firstLink',
        source: 'firstNode',
        target: 'secondNode',
      },
      secondLink: {
        association: 'secondLink',
        id: 'secondLink',
        source: 'thirdNode',
        target: 'firstNode',
      },
    },
    model_url: '/twiglets/name1/model',
    name: 'name1',
    nodes: {
      firstNode: {
        attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
        id: 'firstNode',
        name: 'firstNodeName',
        radius: 10,
        type: 'ent1',
        x: 100,
        y: 100,
      },
      secondNode: {
        attrs: [],
        id: 'secondNode',
        name: 'secondNodeName',
        radius: 10,
        type: 'ent2',
        x: 200,
        y: 300,
      },
      thirdNode: {
        attrs: [],
        id: 'thirdNode',
        name: 'thirdNodeName',
        radius: 10,
        type: 'ent3',
      },
    },
    url: 'twiglet url',
    views_url: 'the views url',
  });
}

export function newNodeTwigletMap () {
  return fromJS({
    _rev: 'rev1',
    changelog_url: '/twiglets/name1/changelog',
    commitMessage: 'The latest commit',
    description: 'a description',
    links: {
    },
    model_url: '/twiglets/name1/model',
    name: 'name1',
    nodes: {
      firstNode: {
        attrs: [],
        id: 'firstNode',
        name: undefined,
        radius: 10,
        type: 'ent2',
        x: 200,
        y: 300,
      }
    },
    url: 'twiglet url',
    views_url: 'the views url',
  });
}
