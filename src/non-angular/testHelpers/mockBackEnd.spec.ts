import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map } from 'immutable';

function twigletResponse () {
  return {
    _rev: 'rev1',
    changelog_url: '/twiglets/name1/changelog',
    commitMessage: 'The latest commit',
    description: 'a description',
    events_url: '/twiglets/name1/events',
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
    sequences_url: '/twiglet/name1/sequences',
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
      sequences_url: '/twiglet/name1/sequences',
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
      sequences_url: '/twiglet/name2/sequences',
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
      scale: 8,
      showLinkLabels: false,
      showNodeLabels: false,
      traverseDepth: 3,
      treeMode: false,
    }
  };
}

function events() {
  return [
    {
      description: 'description #1',
      id: 'e83d0978-6ecc-4102-a782-5b2b58798288',
      name: 'event name 1',
      url: 'http://localhost:3000/v2/twiglets/Gravity/events/e83d0978-6ecc-4102-a782-5b2b58798288'
    },
    {
      description: 'description of another event',
      id: 'e83d0978-6ecc-4102-a782-5b2b58798289',
      name: 'event name 2',
      url: 'http://localhost:3000/v2/twiglets/Gravity/events/e83d0978-6ecc-4102-a782-5b2b58798289'
    },
    {
      description: 'description of even another one',
      id: 'e83d0978-6ecc-4102-a782-5b2b58798290',
      name: 'event name 3',
      url: 'http://localhost:3000/v2/twiglets/Gravity/events/e83d0978-6ecc-4102-a782-5b2b58798290'
    },
    {
      description: 'description of a final event',
      id: 'e83d0978-6ecc-4102-a782-5b2b58798291',
      name: 'event name 4',
      url: 'http://localhost:3000/v2/twiglets/Gravity/events/e83d0978-6ecc-4102-a782-5b2b58798291'
    }
  ];
}

function event(id) {
  return {
    description: `description for ${id}`,
    id,
    links: [
      {
        association: 'some name',
        id: '26ce4b06-af0b-4c29-8368-631441915e67',
        source: 'c11000af-c3a5-4db8-a7ea-74255c6d672e',
        target: 'bb7d6af2-48ed-42f7-9fc1-705eb49b09bc',
      },
      {
        attrs: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' }
        ],
        id: '626158d4-56db-4bfa-822b-9aaf7b17e88f',
        source: 'ab2752a2-cbc5-412d-87f8-fcc4d0000ee8',
        target: 'c11000af-c3a5-4db8-a7ea-74255c6d672e',
      }
    ],
    name: `event name ${id}`,
    nodes: [
      {
        attrs: [],
        id: 'c11000af-c3a5-4db8-a7ea-74255c6d672e',
        location: '',
        name: 'node 1',
        type: 'ent1',
        x: 100,
        y: 200,
      },
      {
        attrs: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' }
        ],
        id: 'bb7d6af2-48ed-42f7-9fc1-705eb49b09bc',
        location: '',
        name: 'node 2',
        type: 'ent2',
        x: 200,
        y: 100,
      },
      {
        attrs: [],
        id: 'ab2752a2-cbc5-412d-87f8-fcc4d0000ee8',
        location: '',
        name: 'node 3',
        type: 'ent3',
        x: 1000,
        y: 900,
      }
    ],
  };
}

function sequences() {
  return [
    {
      id: 'seq1',
      name: 'name1',
    },
    {
      id: 'seq2',
      name: 'name2',
    }
  ];
}

function sequence1() {
  return {
    description: 'some description',
    events: ['e83d0978-6ecc-4102-a782-5b2b58798288', 'e83d0978-6ecc-4102-a782-5b2b58798289'],
    id: 'seq1',
    name: 'name1',
  };
}

function sequence2() {
  return {
    description: 'some other description',
    events: [],
    id: 'seq2',
    name: 'name2',
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
  } else if (connection.request.url.endsWith('/validateJwt')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(userResponse()),
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
  } else if (connection.request.url.endsWith('/events')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(events())
    })));
  } else if (connection.request.url.endsWith('/events/e83d0978-6ecc-4102-a782-5b2b58798288')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(event('e83d0978-6ecc-4102-a782-5b2b58798288'))
    })));
  } else if (connection.request.url.endsWith('/events/e83d0978-6ecc-4102-a782-5b2b58798289')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(event('e83d0978-6ecc-4102-a782-5b2b58798289'))
    })));
  } else if (connection.request.url.endsWith('/events/e83d0978-6ecc-4102-a782-5b2b58798290')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(event('e83d0978-6ecc-4102-a782-5b2b58798290'))
    })));
  } else if (connection.request.url.endsWith('/events/e83d0978-6ecc-4102-a782-5b2b58798290')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(event('e83d0978-6ecc-4102-a782-5b2b58798291'))
    })));
  } else if (connection.request.url.endsWith('/sequences')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(sequences())
    })));
  } else if (connection.request.url.endsWith('/sequences/seq1')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(sequence1())
    })));
  } else if (connection.request.url.endsWith('/sequences/seq2')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(sequence2())
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
