import { Map } from 'immutable';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';

function twigletResponse () {
  return {
    _rev: 'rev1',
    changelog_url: '/twiglets/name1/changelog',
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
    model_url: '/twiglets/name1/model',
    name: 'name1',
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
    url: '/twiglets/name1',
    views_url: '/twiglet/name1/views',
  };
}

 function modelResponse() {
  return {
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
        size: '40',
        type: 'ent1',
      },
      ent2: {
        attributes: [],
        class: 'at',
        color: '#4286f4',
        image: '@',
        size: '40',
        type: 'ent2',
      },
      ent3: {
        attributes: [],
        class: 'hashtag',
        color: '#d142f4',
        image: '#',
        size: '40',
        type: 'ent3',
      },
      ent4: {
        attributes: [],
        class: 'hashtag',
        color: '#9542f4',
        image: '$',
        size: '40',
        type: 'ent4',
      },
      ent4ext: {
        attributes: [],
        class: 'hashtag',
        color: '#000000',
        image: '%',
        size: '50',
        type: 'ent4ext',
      },
      ent5: {
        attributes: [],
        class: 'hashtag',
        color: '#f4424b',
        image: '%',
        size: '40',
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
      model_url: '/twiglet/name1/model',
      name: 'name2',
      orgModel: 'mynewmodel',
      twiglet: '',
      url: 'twigleturl',
      views_url: 'viewsurl'
    },
    {
      changelog_url: 'changelogurl2',
      description: '',
      googlesheet: '',
      model_url: '/twiglet/name2/model',
      name: 'name1',
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

function views() {
  return [
    {
      name: 'view1',
      url: '/twiglets/t1/views/view1'
    },
    {
      name: 'view2',
      url: '/twiglets/t1/views/view2'
    }
  ];
}

function view() {
  return {
    description: 'description of view',
    name: 'view1',
    url: '/twiglets/t1/views/view1',
    userState: {
      autoConnectivity: 'in',
      autoScale: 'linear',
      bidirectionalLinks: true,
      cascadingCollapse: true,
      currentNode: null,
      filters: {
        attributes: [],
        types: { }
      },
      forceChargeStrength: 0.1,
      forceGravityX: 0.1,
      forceGravityY: 1,
      forceLinkDistance: 20,
      forceLinkStrength: 0.5,
      forceVelocityDecay: 0.9,
      linkType: 'path',
      nodeSizingAutomatic: true,
      scale: 8,
      showLinkLabels: false,
      showNodeLabels: false,
      traverseDepth: 3,
      treeMode: false,
    }
  };
}

export const successfulMockBackend = new MockBackend();
successfulMockBackend.connections.subscribe(connection => {
  if (connection.request.url.endsWith('/model')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(modelResponse())
    })));
  } else if (connection.request.url.endsWith('/twiglets/name1')) {
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
  } else if (connection.request.url.endsWith('/twiglet/name1/model')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(modelResponse())
    })));
  } else if (connection.request.url.endsWith('/twiglet/name1/views')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(views())
    })));
  } else if (connection.request.url.endsWith('/login')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(userResponse())
    })));
  } else if (connection.request.url.endsWith('/logout')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: '',
    })));
  } else if (connection.request.url.endsWith('/changelog')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(changelogResponse())
    })));
  } else if (connection.request.url.endsWith('/views')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(views())
    })));
  } else if (connection.request.url.endsWith('/views/view1')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(view())
    })));
  } else if (connection.request.url.endsWith('/ping')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({ authenticated: 'true' })
    })));
  } else {
    console.warn('unmapped mockBackendRoute: ', connection.request.url);
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(connection.request.url)
    })));
  }
});
