import { Map } from 'immutable';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';

function twigletResponse () {
  return {
    changelog_url: 'the changelog url',
    commitMessage: 'The latest commit',
    description: 'a description',
    links: [
      {
        association: 'firstLink',
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
    model_url: '/twiglets/id1/model',
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
        size: 40
      },
      ent2: {
        class: 'at',
        color: '#4286f4',
        image: '@',
        size: 40
      },
      ent3: {
        class: 'hashtag',
        color: '#d142f4',
        image: '#',
        size: 40
      },
      ent4: {
        class: 'hashtag',
        color: '#9542f4',
        image: '$',
        size: 40
      },
      ent5: {
        class: 'hashtag',
        color: '#f4424b',
        image: '%',
        size: 40
      },
    },
  };
}

function modelsResponse() {
  return [
    {
      _id: 'bsc',
      url: 'modelurl'
    },
    {
      _id: 'bsc - clone',
      url: 'modelurl2'
    },
  ];
}

function twigletsResponse() {
  return [
    {
      _id: 'id1',
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
      _id: 'id2',
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
  } else if (connection.request.url.endsWith('/twiglets')) {
    connection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(twigletsResponse())
    })));
  }
});
