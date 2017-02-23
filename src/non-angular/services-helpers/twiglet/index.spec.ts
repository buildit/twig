import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map } from 'immutable';

import { TwigletService } from './index';
import { D3Node, Link } from '../../interfaces/twiglet';
import { StateCatcher } from '../index';
import { UserStateService } from '../userState';

describe('twigletService', () => {
  const mockTwigletResponse = {
    links: [],
    model_url: 'twiglet/name1/model',
    name: 'name1',
    nodes: [ 'node1' ]
  };

  const mockModelResponse = {
    entities: {
      entity1: {
        type: 'type1'
      },
      entity2: {
        type: 'type2'
      }
    }
  };

  const mockBackend = new MockBackend();

  let twigletService: TwigletService;
  beforeEach(() => {
    twigletService = new TwigletService(new Http(mockBackend, new BaseRequestOptions()), null, null, null);
  });

  describe('Observables', () => {
    it('returns an observable with a name, description, nodes and links at initiation', () => {
      twigletService.observable.subscribe(response => {
        expect(response.size).toEqual(5);
      });
    });
  });

  describe('LinksService', () => {
    const initialLinks: Link[] = [
      {
        association: 'First Link',
        id: 'firstLink',
        source: 'node1',
        target: 'node2',
      },
      {
        association: 'Second Link',
        id: 'secondLink',
        source: 'node3',
        target: 'node4',
      },
      {
        association: 'Third Link',
        id: 'thirdLink',
        source: 'node5',
        target: 'node6',
      }
    ];

    describe('Adding Links', () => {
      it('can add an array of links as immutable maps', () => {
        twigletService.addLinks(initialLinks);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          expect(response.size).toEqual(3);
          const firstLink = response.get('firstLink');
          expect(Map.isMap(firstLink)).toEqual(true);
          expect(firstLink.get('association')).toEqual('First Link');
          expect(firstLink.get('id')).toEqual('firstLink');
          expect(firstLink.get('source')).toEqual('node1');
          expect(firstLink.get('target')).toEqual('node2');
          const secondLink = response.get('secondLink');
          expect(Map.isMap(secondLink)).toEqual(true);
          expect(secondLink.get('association')).toEqual('Second Link');
          expect(secondLink.get('id')).toEqual('secondLink');
          expect(secondLink.get('source')).toEqual('node3');
          expect(secondLink.get('target')).toEqual('node4');
          const thirdLink = response.get('thirdLink');
          expect(Map.isMap(thirdLink)).toEqual(true);
          expect(thirdLink.get('association')).toEqual('Third Link');
          expect(thirdLink.get('id')).toEqual('thirdLink');
          expect(thirdLink.get('source')).toEqual('node5');
          expect(thirdLink.get('target')).toEqual('node6');
        });
      });

      it('can add a single link as an immutable map', () => {
        twigletService.addLink({
          id: 'singleLink',
          source: 'a source',
          target: 'a target',
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          expect(response.size).toEqual(1);
          const firstLink = response.get('singleLink');
          expect(Map.isMap(firstLink)).toEqual(true);
          expect(firstLink.get('id')).toEqual('singleLink');
          expect(firstLink.get('source')).toEqual('a source');
          expect(firstLink.get('target')).toEqual('a target');
        });
      });
    });

    describe('updateLinks', () => {
      beforeEach(() => {
        twigletService.addLinks(initialLinks);
      });

      it('can update multiple links at a time and still return immutables', () => {
        twigletService.updateLinks([
          {
            association: 'New Name',
            id: 'firstLink',
            source: 'node1',
            target: 'node2',
          },
          {
            id: 'secondLink',
            source: 'new source',
            target: 'node4',
          },
          {
            id: 'thirdLink',
            source: 'node5',
            target: 'new target',
          },
        ]);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          expect(response.size).toEqual(3);
          const firstLink = response.get('firstLink');
          expect(Map.isMap(firstLink)).toEqual(true);
          expect(firstLink.get('association')).toEqual('New Name'); // updated
          expect(firstLink.get('id')).toEqual('firstLink');
          expect(firstLink.get('source')).toEqual('node1');
          expect(firstLink.get('target')).toEqual('node2');
          const secondLink = response.get('secondLink');
          expect(Map.isMap(secondLink)).toEqual(true);
          expect(secondLink.get('association')).toEqual('Second Link');
          expect(secondLink.get('id')).toEqual('secondLink');
          expect(secondLink.get('source')).toEqual('new source'); // updated
          expect(secondLink.get('target')).toEqual('node4');
          const thirdLink = response.get('thirdLink');
          expect(Map.isMap(thirdLink)).toEqual(true);
          expect(thirdLink.get('association')).toEqual('Third Link');
          expect(thirdLink.get('id')).toEqual('thirdLink');
          expect(thirdLink.get('source')).toEqual('node5');
          expect(thirdLink.get('target')).toEqual('new target'); // updated
        });
      });

      it('can update a single link and leave the link as an immutable', () => {
        twigletService.updateLink({
          association: 'New Name',
          id: 'firstLink',
          source: 'new source',
          target: 'new target',
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          const firstLink = response.get('firstLink');
          expect(Map.isMap(firstLink)).toEqual(true);
          expect(firstLink.get('association')).toEqual('New Name'); // updated
          expect(firstLink.get('id')).toEqual('firstLink');
          expect(firstLink.get('source')).toEqual('new source');
          expect(firstLink.get('target')).toEqual('new target');
        });
      });
    });

    describe('deleteLinks', () => {
      beforeEach(() => {
        twigletService.addLinks(initialLinks);
      });

      it('can delete multiple links at a time and leave the remaining as immutables', () => {
        twigletService.removeLinks([
          {
            id: 'secondLink',
          },
          {
            id: 'thirdLink',
          },
        ]);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          expect(response.size).toEqual(1);
          expect(Map.isMap(response.get('firstLink'))).toEqual(true);
        });
      });

      it('can delete a single link and leave the remaining as immutable', () => {
        twigletService.removeLink({
          id: 'secondLink',
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('links');
          expect(response.size).toEqual(2);
          expect(Map.isMap(response.get('firstLink'))).toEqual(true);
          expect(Map.isMap(response.get('thirdLink'))).toEqual(true);
        });
      });
    });
  });

  describe('NodesService', () => {
    const initialNodes: D3Node[] = [
      {
        id: 'firstNode',
        name: 'firstNodeName',
        type: 'ent1',
        x: 100,
        y: 150,
      },
      {
        id: 'secondNode',
        name: 'secondNodeName',
        type: 'ent2',
        x: 200,
        y: 300,
      },
      {
        id: 'thirdNode',
        name: 'thirdNodeName',
        type: 'ent3',
      }
    ];

    describe('Adding Nodes', () => {
      it('can add an array of Nodes as immutable maps', () => {
        twigletService.addNodes(initialNodes);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          expect(response.size).toEqual(3);
          const firstNode = response.get('firstNode');
          expect(Map.isMap(firstNode)).toEqual(true);
          expect(firstNode.get('id')).toEqual('firstNode');
          expect(firstNode.get('name')).toEqual('firstNodeName');
          expect(firstNode.get('type')).toEqual('ent1');
          expect(firstNode.get('x')).toEqual(100);
          expect(firstNode.get('y')).toEqual(150);
          const secondNode = response.get('secondNode');
          expect(Map.isMap(secondNode)).toEqual(true);
          expect(secondNode.get('id')).toEqual('secondNode');
          expect(secondNode.get('name')).toEqual('secondNodeName');
          expect(secondNode.get('type')).toEqual('ent2');
          expect(secondNode.get('x')).toEqual(200);
          expect(secondNode.get('y')).toEqual(300);
          const thirdNode = response.get('thirdNode');
          expect(Map.isMap(thirdNode)).toEqual(true);
          expect(thirdNode.get('id')).toEqual('thirdNode');
          expect(thirdNode.get('name')).toEqual('thirdNodeName');
          expect(thirdNode.get('type')).toEqual('ent3');
        });
      });

      it('can add a single Node as an immutable map', () => {
        twigletService.addNode({
          id: 'singleNode',
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          expect(response.size).toEqual(1);
          const firstNode = response.get('singleNode');
          expect(Map.isMap(firstNode)).toEqual(true);
          expect(firstNode.get('id')).toEqual('singleNode');
        });
      });
    });

    describe('updateNodes', () => {
      beforeEach(() => {
        twigletService.addNodes(initialNodes);
      });

      it('can update multiple Nodes at a time and still return immutables', () => {
        twigletService.updateNodes([
          {
            id: 'firstNode',
            name: 'new First Node',
          },
          {
            id: 'secondNode',
            type: 'ent4',
          },
          {
            id: 'thirdNode',
            x: 1000,
            y: 1500,
          },
        ]);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          // No new nodes - DJ Khaled
          expect(response.size).toEqual(3);
          const firstNode = response.get('firstNode');
          expect(Map.isMap(firstNode)).toEqual(true);
          expect(firstNode.get('id')).toEqual('firstNode');
          expect(firstNode.get('name')).toEqual('new First Node');
          expect(firstNode.get('type')).toEqual('ent1');
          expect(firstNode.get('x')).toEqual(100);
          expect(firstNode.get('y')).toEqual(150);
          const secondNode = response.get('secondNode');
          expect(Map.isMap(secondNode)).toEqual(true);
          expect(secondNode.get('id')).toEqual('secondNode');
          expect(secondNode.get('name')).toEqual('secondNodeName');
          expect(secondNode.get('type')).toEqual('ent4');
          expect(secondNode.get('x')).toEqual(200);
          expect(secondNode.get('y')).toEqual(300);
          const thirdNode = response.get('thirdNode');
          expect(Map.isMap(thirdNode)).toEqual(true);
          expect(thirdNode.get('id')).toEqual('thirdNode');
          expect(thirdNode.get('name')).toEqual('thirdNodeName');
          expect(thirdNode.get('type')).toEqual('ent3');
          expect(thirdNode.get('x')).toEqual(1000);
          expect(thirdNode.get('y')).toEqual(1500);
        });
      });

      it('passes the new state to stateCatcher if one is passed in to updateNodes', () => {
        const state: StateCatcher = {
          data: null,
        };
        twigletService.updateNodes(initialNodes, state);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse;
          expect(response).toBe(state.data);
        });
      });

      it('can update a single Node and leave the Node as an immutable', () => {
        twigletService.updateNode({
          id: 'firstNode',
          name: 'another new name',
          type: 'whatever',
          x: 1000,
          y: 1500,
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          // No new nodes
          expect(response.size).toEqual(3);

          const firstNode = response.get('firstNode');
          expect(Map.isMap(firstNode)).toEqual(true);
          expect(firstNode.get('name')).toEqual('another new name'); // updated
          expect(firstNode.get('type')).toEqual('whatever');
          expect(firstNode.get('x')).toEqual(1000);
          expect(firstNode.get('y')).toEqual(1500);
        });
      });
    });

    describe('deleteNodes', () => {
      beforeEach(() => {
        twigletService.addNodes(initialNodes);
      });

      it('can delete multiple Nodes at a time and leave the remaining as immutables', () => {
        twigletService.removeNodes([
          {
            id: 'secondNode',
          },
          {
            id: 'thirdNode',
            name: 'thirdNodeName',
            type: '$',
          },
        ]);
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          expect(response.size).toEqual(1);
          expect(Map.isMap(response.get('firstNode'))).toEqual(true);
        });
      });

      it('can delete a single Node and leave the remaining as immutable', () => {
        twigletService.removeNode({
          id: 'secondNode'
        });
        twigletService.observable.subscribe(twigletResponse => {
          const response = twigletResponse.get('nodes');
          expect(response.size).toEqual(2);
          expect(Map.isMap(response.get('firstNode'))).toEqual(true);
          expect(Map.isMap(response.get('thirdNode'))).toEqual(true);
        });
      });
    });
  });
});
