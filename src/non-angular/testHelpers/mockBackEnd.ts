import { Map } from 'immutable';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';

function twigletResponse () {
  return {
    _rev: 'rev1',
    changelog_url: '/twiglets/twiglet%20name/changelog',
    commitMessage: 'The latest commit',
    description: 'a description',
    links: [
      {
        association: 'firstLink',
        attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
        id: 'firstLink',
        source: 'firstNode',
        target: 'secondNode',
      },
      {
        association: 'secondLink',
        id: 'secondLink',
        source: 'firstNode',
        target: 'thirdNode',
      },
    ],
    model_url: '/twiglets/twiglet%20name/model',
    name: 'twiglet name',
    nodes: [
      {
        attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
        id: 'firstNode',
        name: 'firstNodeName',
        radius: 10,
        type: 'ent1',
        x: 100,
        y: 100,
      },
      {
        attrs: [],
        id: 'secondNode',
        name: 'secondNodeName',
        radius: 10,
        type: 'ent2',
        x: 200,
        y: 300,
      },
      {
        attrs: [],
        id: 'thirdNode',
        name: 'thirdNodeName',
        radius: 10,
        type: 'ent3',
      }
    ],
    url: 'twiglet url',
    views_url: 'the views url',
  };
}

function modelResponse() {
  return {
    _rev: 'some revision number',
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
      ent4ext: {
        class: 'hashtag',
        color: '#000000',
        image: '%',
        size: 50,
        type: 'ent4ext',
      },
      ent5: {
        class: 'hashtag',
        color: '#f4424b',
        image: '%',
        size: 40,
        type: 'ent5',
      },
    },
  };
}

function modelsResponse() {
  return [
    {
      changelog_url: 'model/modelurl/changelog',
      name: 'bsc',
      url: 'modelurl'
    },
    {
      changelog_url: 'model/modelurl2/changelog',
      name: 'bsc - clone',
      url: 'modelurl2'
    },
  ];
}

function twigletsResponse() {
  return [
    {
      changelog_url: 'changelogurl',
      description: '',
      googlesheet: '',
      model_url: 'modelurl',
      name: 'name1',
      orgModel: 'mynewmodel',
      twiglet: '',
      url: 'twigleturl',
      views_url: 'viewsurl'
    },
    {
      changelog_url: 'changelogurl2',
      description: '',
      googlesheet: '',
      model_url: 'modelurl2',
      name: 'name2',
      orgModel: 'bsc',
      twiglet: '',
      url: 'twigleturl2',
      views_url: 'viewsurl2'
    },
  ];
}

function userResponse() {
  return {
    user: {
      email: 'user@email.com',
      name: 'user@email.com'
    }
  };
}

function changelogResponse() {
  return {
    changelog: [
      {
        message: 'edit made',
        timestamp: '2017-01-25T22:51:53.878Z',
        user: 'user@email.com'
      },
      {
        message: 'twiglet created',
        timestamp: '2017-01-25T22:51:53.878Z',
        user: 'user@email.com'
      }
    ]
  };
}

function bsc() {
  return {
    _rev: '10-f55e992e501c818563b308f239211311',
    changelog_url: 'http://localhost:3000/models/bsc/changelog',
    entities: {
      chapter: {
        class: 'comments',
        color: '#2ca02c',
        image: '',
        size: '30',
        type: 'chapter'
      },
      'client-organisation': {
        class: 'building',
        color: '#aec7e8',
        image: '',
        size: '40',
        type: 'client-organisation'
      },
      'client-person': {
        class: 'user',
        color: '#8c564b',
        image: '',
        size: '20',
        type: 'client-person'
      },
      engagement: {
        class: 'briefcase',
        color: '#ff9896',
        image: '',
        size: '30',
        type: 'engagement'
      },
      'ext-organisation': {
        class: 'building',
        color: '#1f77b4',
        image: '',
        size: '40',
        type: 'ext-organisation'
      },
      'ext-person': {
        class: 'user',
        color: '#c5b0d5',
        image: '',
        size: '20',
        type: 'ext-person'
      },
      organisation: {
        class: 'building',
        color: '#ff7f0e',
        image: '',
        size: '40',
        type: 'organisation'
      },
      person: {
        class: 'user',
        color: '#9467bd',
        image: '',
        size: '20',
        type: 'person'
      },
      region: {
        class: 'globe',
        color: '#98df8a',
        image: '',
        size: '30',
        type: 'region'
      },
      squad: {
        class: 'cogs',
        color: '#d62728',
        image: '',
        size: '25',
        type: 'squad'
      },
      tribe: {
        class: 'users',
        color: '#ffbb78',
        image: '',
        size: '40',
        type: 'tribe'
      },
    },
    name: 'bsc',
    url: 'http://localhost:3000/models/bsc',
  };
}

function miniModel() {
  const mini = modelResponse() as any;
  mini.name = 'miniModel';
  mini.url = 'http://localhost:3000/models/miniModel';
  return mini;
}

export const successfulMockBackend = new MockBackend();
successfulMockBackend.connections.subscribe(connection => {
  if (connection.request.url.endsWith('/model')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(modelResponse())
    })));
  } else if (connection.request.url.endsWith('/twiglets/id1')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(twigletResponse())
    })));
  } else if (connection.request.url.endsWith('/models')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(modelsResponse())
    })));
  } else if (connection.request.url.endsWith('/models/bsc')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(bsc())
      })));
  } else if (connection.request.url.endsWith('/models/miniModel')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(miniModel())
      })));
  } else if (connection.request.url.endsWith('/twiglets')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(twigletsResponse())
    })));
  } else if (connection.request.url.endsWith('/login')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(userResponse())
    })));
  } else if (connection.request.url.endsWith('/changelog')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(changelogResponse())
    })));
  }
});
