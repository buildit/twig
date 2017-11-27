import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map, List } from 'immutable';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs/Rx';
import { clone } from 'ramda';

import { D3Node, Link } from '../../interfaces/twiglet';
import { mockToastr, successfulMockBackend } from '../../testHelpers';
import { StateCatcher } from '../index';
import { TwigletService } from './index';
import { UserStateService } from '../userState';
import TWIGLET from './constants';
import NODE from './constants/node';
import LINK from './constants/link';
import VIEW from './constants/view';
import VIEW_DATA from './constants/view/data';

describe('twigletService', () => {
  const userStateBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userState = {
    observable: userStateBs.asObservable(),
    setLevelFilterMax: jasmine.createSpy('setLevelFilterMax'),
    startSpinner: jasmine.createSpy('startSpinner'),
    stopSpinner: jasmine.createSpy('stopSpinner'),
  };
  const ngZone = {
    runOutsideAngular(fn) {
      fn();
    }
  };
  let userReplaySubject: ReplaySubject<boolean>;
  let router;
  let twigletService: TwigletService;
  let http: Http;
  beforeEach(() => {
    userReplaySubject = new ReplaySubject;
    const modelService = {
      open() {
        return {
          componentInstance: {
            userResponse: userReplaySubject,
          },
          close() {}
        };
      },
    };
    router = {
      navigate: jasmine.createSpy('navigate'),
    };
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    twigletService = new TwigletService(http, <any>mockToastr(), <any>router, <any>modelService, true, <any>userState, <any>ngZone);
  });

  describe('Observables', () => {
    it('returns an observable with a name, description, urls, git nodes and links at initiation', () => {
      twigletService.observable.subscribe(response => {
        expect(response.size).toEqual(10);
      });
    });

    it('returns a list of twiglets', () => {
      twigletService.twiglets.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('createBackup', () => {
    it('saves a backup', () => {
      twigletService.createBackup();
      expect(twigletService['_twigletBackup']).not.toBe(null);
    });
  });

  describe('restoreBackup', () => {
    describe('backup exists', () => {
      let result;
      const twigletName = 'a';
      beforeEach(() => {
        twigletService.createBackup();
        twigletService['_twiglet'].next(Map({ [twigletName]: 'twiglet' }));
        result = twigletService.restoreBackup();
      });

      it('restores the backup', () => {
        expect(twigletService.observable.subscribe(response => {
          expect(response.get(twigletName)).toBe(undefined);
        }));
      });

      it('returns true if there is a backup', () => {
        expect(result).toBe(true);
      });
    });

    describe('backup does not exist', () => {
      it('returns false', () => {
        expect(twigletService.restoreBackup()).toBe(false);
      });
    });
  });

  describe('updateListOfTwiglets', () => {
    it('alphabetizes the twiglet names', () => {
      twigletService.twiglets.subscribe((response: List<Map<string, any>>) => {
        expect(response.get(0).get(TWIGLET.NAME)).toEqual('name1');
      });
    });
  });

  describe('clearCurrentTwiglet', () => {
    it('sets the current twiglet to a blank', () => {
      twigletService.clearCurrentTwiglet();
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get(TWIGLET.NAME)).toEqual('');
      });
    });
  });

  describe('updateNodeTypes', () => {
    beforeEach((done) => {
      twigletService['viewData'] = fromJS({
        data: {
          filters: [],
          levelFilter: '-1',
        }
      });
      twigletService.loadTwiglet('name1').subscribe(response => {
        done();
      });
    });

    it('can update nodes types', () => {
      twigletService.updateNodeTypes('ent1', 'ent4');
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.getIn([TWIGLET.NODES, 'firstNode', NODE.TYPE])).toEqual('ent4');
      });
    });

    it('does not update if the types are the same', () => {
      spyOn(twigletService['_twiglet'], 'next');
      twigletService.updateNodeTypes('ent1', 'ent1');
      expect(twigletService['_twiglet'].next).not.toHaveBeenCalled();
    });

    it('does not update if the none of the nodes were updated', () => {
      spyOn(twigletService['_twiglet'], 'next');
      twigletService.updateNodeTypes('ent4', 'ent5');
      expect(twigletService['_twiglet'].next).not.toHaveBeenCalled();
    });
  });

  describe('loadTwiglet', () => {
     beforeEach(() => {
      twigletService['userState'] = fromJS({
        filters: [],
        levelFilter: '-1',
      });
    });

    it('returns the twiglet and model', () => {
      twigletService.loadTwiglet('name1').subscribe(response => {
        expect(response['modelFromServer']).not.toBe(null);
        expect(response['twigletFromServer']).not.toBe(null);
      });
    });

    it('returns an error if needed', () => {
      const badBackend = new MockBackend();
      twigletService['http'] = new Http(badBackend, new BaseRequestOptions());
      badBackend.connections.subscribe(connection => {
        connection.mockError(new Error('all the errors!'));
      });
      // No spam in console.
      spyOn(console, 'error');
      twigletService.loadTwiglet('name1').subscribe(response => {
        expect('this should never be called').toEqual('was called');
      }, (error) => {
        expect(error.message).toEqual('all the errors!');
      });
    });
  });

  describe('setName', () => {
    it('can be set', () => {
      twigletService.setName('some name');
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get(TWIGLET.NAME)).toEqual('some name');
      });
    });
  });

  describe('setDescription', () => {
    it('can be set', () => {
      twigletService.setDescription('some description');
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get(TWIGLET.DESCRIPTION)).toEqual('some description');
      });
    });
  });

  describe('addTwiglet', () => {
    let post;
    let response;
    beforeEach(() => {
      post = spyOn(http, 'post').and.callThrough();
      twigletService.addTwiglet({ some: 'body' }).subscribe(_response => {
        response = _response;
      });
    });

    it('posts to the correct url', () => {
      expect(post.calls.argsFor(0)[0].endsWith('/twiglets')).toEqual(true);
    });

    it('returns the response', () => {
      expect(response).not.toBe(null);
    });
  });

  describe('removeTwiglet', () => {
    let del;
    let response;
    beforeEach(() => {
      del = spyOn(http, 'delete').and.callThrough();
      twigletService.removeTwiglet('name1').subscribe(_response => {
        response = _response;
      });
    });

    it('deletes to the correct url', () => {
      expect(del.calls.argsFor(0)[0].endsWith('/twiglets/name1')).toEqual(true);
    });

    it('returns the response', () => {
      expect(response).not.toBe(null);
    });
  });

  describe('saveChanges', () => {
    beforeEach(() => {
      twigletService['userState'] = fromJS({
        filters: [],
        levelFilter: '-1',
      });
    });

    describe('success', () => {
      let put;
      let currentTwiglet;
      beforeEach(() => {
        put = spyOn(http, 'put').and.callThrough();
        twigletService.loadTwiglet('name1').subscribe(serverResponse => {
          currentTwiglet = serverResponse.twigletFromServer;
          twigletService.setName('other name');
          twigletService.setDescription('other description');
          twigletService.saveChanges('some commit message').subscribe();
        });
      });

      it('has the correct rev', () => {
        expect(put.calls.argsFor(0)[1]._rev).toEqual(currentTwiglet._rev);
      });

      it('has the paramed commit message', () => {
        expect(put.calls.argsFor(0)[1].commitMessage).toEqual('some commit message');
      });

      it('has the correct name', () => {
        expect(put.calls.argsFor(0)[1].name).toEqual('other name');
      });

      it('has the correct description', () => {
        expect(put.calls.argsFor(0)[1].description).toEqual('other description');
      });

      it('turns the immutable map of links into an array', () => {
        expect(Array.isArray(put.calls.argsFor(0)[1].links)).toEqual(true);
      });

      it('turns the immutable map into an array', () => {
        expect(Array.isArray(put.calls.argsFor(0)[1].nodes)).toEqual(true);
      });
    });

    describe('overwrite prompting', () => {
      let response;
      beforeEach(() => {
        response = null;
        twigletService.loadTwiglet('name1').subscribe(serverResponse => {
          const errorBackend = new MockBackend();
          errorBackend.connections.subscribe(connection => {
            const errorResponse = {
              _body: JSON.stringify({ data: { latestCommit: { user: 'user' }} }),
              message: 'all the errors!',
              status: 409,
            };
            connection.mockError(errorResponse);
          });
          twigletService['http'] = new Http(errorBackend, new BaseRequestOptions());
          twigletService.saveChanges('should fail').subscribe(_response => response = _response);
        });
      });

      it('calls save changes again if the users clicks yes', () => {
        spyOn(twigletService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(true);
        expect(twigletService.saveChanges).toHaveBeenCalledTimes(1);
      });

      it('returns a response once overwritten', () => {
        spyOn(twigletService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(true);
        expect(response).toEqual('whatever');
      });

      it('does nothing if the user clicks no', () => {
        spyOn(twigletService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(false);
        expect(twigletService.saveChanges).not.toHaveBeenCalled();
      });

      it('returns a error if the user clicks no', () => {
        userReplaySubject.next(false);
        expect(response.status).toEqual(409);
      });
    });

    describe('other errors', () => {
      let error;
      beforeEach(() => {
        error = null;
        spyOn(http, 'put').and.callThrough();
        twigletService.loadTwiglet('name1').subscribe(serverResponse => {
          const errorBackend = new MockBackend();
          errorBackend.connections.subscribe(connection => {
            const errorResponse = {
              message: 'all the errors!',
              status: 400,
            };
            connection.mockError(errorResponse);
          });
          twigletService['http'] = new Http(errorBackend, new BaseRequestOptions());
          twigletService.saveChanges('should fail')
              .subscribe(() => undefined, _error => error = _error);
        });
      });
      it('gets the error back from the server', () => {
        expect(error.status).toEqual(400);
      });
    });
  });

  describe('addNode', () => {
    it('calls addNodes', () => {
      spyOn(twigletService, 'addNodes');
      twigletService.addNode({ id: 'an id' });
      expect(twigletService.addNodes).toHaveBeenCalledTimes(1);
    });
  });

  describe('addNodes', () => {
    it('can add to the node numbers', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.addNode({ id: 'an id' });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.NODES).size).toEqual(4);
        });
      });
    });
  });

  describe('clearNodes', () => {
    it('clears all of the nodes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.clearNodes();
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.NODES).size).toEqual(0);
        });
      });
    });
  });

  describe('updateNodeParam', () => {
    it('can update a non-location parameter', () => {
      twigletService.loadTwiglet('name1').subscribe((infoFromServer) => {
        twigletService.updateNodeCoordinates(infoFromServer.twigletFromServer.nodes)
        twigletService.updateNodeParam('firstNode', NODE.NAME, 'a new name');
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn([TWIGLET.NODES, 'firstNode', NODE.NAME])).toEqual('a new name');
        });
      });
    });

    it('can update a location parameter', () => {
      twigletService.loadTwiglet('name1').subscribe((infoFromServer) => {
        twigletService.updateNodeCoordinates(infoFromServer.twigletFromServer.nodes)
        twigletService.updateNodeParam('firstNode', NODE.GRAVITY_POINT, 'some id');
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn([TWIGLET.NODES, 'firstNode', NODE.GRAVITY_POINT])).toEqual('some id');
        });
      });
    });
  });

  describe('updateNode', () => {
    it('calls updateNodes', () => {
      spyOn(twigletService, 'updateNodes');
      twigletService.updateNode({ id: 'an id' });
      expect(twigletService.updateNodes).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateNodes', () => {
    it('can change node attributes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.updateNode({ id: 'firstNode', name: 'new name' });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn([TWIGLET.NODES, 'firstNode', NODE.NAME])).toEqual('new name');
        });
      });
    });
  });

  describe('replaceNodesAndLinks', () => {
    it('can replace all of the nodes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.replaceNodesAndLinks([{ id: 'an id' }], []);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.NODES).size).toEqual(1);
        });
      });
    });

    it('can replace all of the links', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.replaceNodesAndLinks(
          [{ id: 'whatever'}],
          [{ id: 'an id', source: 'whatever', target: 'whatever' }]
        );
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.LINKS).size).toEqual(1);
        });
      });
    });

    it('merges the node-positions if they exist', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.updateNodeCoordinates([{ id: 'an id', x: 100, y: 150 }]);
        twigletService.replaceNodesAndLinks([{ id: 'an id', x: 50, y: 75 }], []);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn([TWIGLET.NODES, 'an id', NODE.X])).toEqual(100);
          expect(twiglet.getIn([TWIGLET.NODES, 'an id', NODE.Y])).toEqual(150);
        });
      });
    });
  });

  describe('updateNodeCoordinates', () => {
    it('stores the x position', () => {
      twigletService.updateNodeCoordinates([{ id: 'an id', x: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes['an id'].x).toEqual(100);
      });
    });

    it('stores the y position', () => {
      twigletService.updateNodeCoordinates([{ id: 'an id', y: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes['an id'].y).toEqual(100);
      });
    });

    it('stores the fx position', () => {
      twigletService.updateNodeCoordinates([{ id: 'an id', fx: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes['an id'].fx).toEqual(100);
      });
    });

    it('stores the fy position', () => {
      twigletService.updateNodeCoordinates([{ id: 'an id', fy: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes['an id'].fy).toEqual(100);
      });
    });

    it('does not store any other attributes', () => {
      twigletService.updateNodeCoordinates([{ id: 'an id', type: 'ent1' }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes['an id']['type']).toBe(undefined);
      });
    });
  });

  describe('removeNode', () => {
    it('calls removeNodes', () => {
      spyOn(twigletService, 'removeNodes');
      twigletService.removeNode({ id: 'firstNode' });
      expect(twigletService.removeNodes).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeNodes', () => {
    it('can remove a node', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.removeNode({ id: 'firstNode' });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.NODES).size).toEqual(2);
          expect(twiglet.get(TWIGLET.NODES).every(node => node.get(TWIGLET.NAME) !== 'firstNodeName')).toBeTruthy();
        });
      });
    });
  });

  describe('addlink', () => {
    it('calls addlinks', () => {
      spyOn(twigletService, 'addLinks');
      twigletService.addLink({
        id: 'singleLink',
        source: 'a source',
        target: 'a target',
      });
      expect(twigletService.addLinks).toHaveBeenCalledTimes(1);
    });
  });

  describe('addlinks', () => {
    it('can add to the link numbers', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.addLink({
          id: 'singleLink',
          source: 'firstNode',
          target: 'secondNode',
        });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.LINKS).size).toEqual(3);
        });
      });
    });
  });

  describe('clearLinks', () => {
    it('clears all of the links', () => {
      twigletService.clearLinks();
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get(TWIGLET.LINKS).size).toEqual(0);
      });
    });
  });

  describe('updateLink', () => {
    it('calls updateLinks', () => {
      spyOn(twigletService, 'updateLinks');
      twigletService.updateLink({
        association: 'new name',
        id: 'singleLink',
        source: 'a source',
        target: 'a target',
      });
      expect(twigletService.updateLinks).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLinks', () => {
    it('can change Link attributes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.updateLinks([{
          association: 'new association',
          id: 'firstLink',
          source: 'firstNode',
          target: 'secondNode',
        }]);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn([TWIGLET.LINKS, 'firstLink', LINK.ASSOCIATION])).toEqual('new association');
        });
      });
    });
  });

  describe('removeLink', () => {
    it('calls removeLinks', () => {
      spyOn(twigletService, 'removeLinks');
      twigletService.removeLink({ id: 'firstLink' });
      expect(twigletService.removeLinks).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeLinks', () => {
    beforeEach(() => {
      twigletService['userState'] = fromJS({
        filters: [],
        levelFilter: '-1',
      });
    });

    it('can remove a Link', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.removeLink({ id: 'firstLink' });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get(TWIGLET.LINKS).size).toEqual(1);
          expect(twiglet.get(TWIGLET.LINKS).every(l => l.get(LINK.ASSOCIATION) !== 'firstLink')).toBeTruthy();
        });
      });
    });
  });

  describe('setDepths', () => {
    function linkMapOf(type: string, links: Link[]) {
      return links.reduce((object, link) => {
        if (object[link[type]]) {
          object[link[type]].push(link.id);
        } else {
          object[link[type]] = [link.id];
        }
        return object;
      }, {});
    }

    function nodesAndLinks(): { nodes: { [key: string]: D3Node }, links: { [key: string]: Link } } {
      const nodes = {
        'node0.0': { id: 'node0.0' },
        'node0.1': { id: 'node0.1' },
        'node1.0': { id: 'node1.0' },
        'node1.1': { id: 'node1.1' },
        'node2.0': { id: 'node2.0' },
        'node2.1': { id: 'node2.1' },
        'node2.2': { id: 'node2.2' },
        'node2.3': { id: 'node2.3' },
      };
      const links = {
        'link0.0-1.0': { id: 'link0.0-1.0', source: 'node0.0', target: 'node1.0' },
        'link0.0-1.1': { id: 'link0.0-1.1', source: 'node0.0', target: 'node1.1' },
        'link1.0-2.0': { id: 'link1.0-2.0', source: 'node1.0', target: 'node2.0' },
        'link1.0-2.1': { id: 'link1.0-2.1', source: 'node1.0', target: 'node2.1' },
        'link1.1-2.2': { id: 'link1.1-2.2', source: 'node1.1', target: 'node2.2' },
        'link1.1-2.3': { id: 'link1.1-2.3', source: 'node1.1', target: 'node2.3' },
        'link2.0-1.0': { id: 'link2.0-1.0', source: 'node2.0', target: 'node1.0' },
        'link2.1-1.1': { id: 'link2.1-1.1', source: 'node2.1', target: 'node1.1' },
        'link2.1-2.3': { id: 'link2.1-2.3', source: 'node2.1', target: 'node2.3' },
        'link2.3-2.1': { id: 'link2.3-2.1', source: 'node2.3', target: 'node2.1' },
      };
      return { nodes, links };
    }

    let maxDepth;

    beforeEach(() => {
      const { nodes, links } = nodesAndLinks();
      twigletService['allNodes'] = nodes;
      twigletService['allLinks'] = links;
      const linksArray = Reflect.ownKeys(links).map(key => links[key]);
      const linkSourceMap = linkMapOf('source', linksArray);
      const linkTargetMap = linkMapOf('target', linksArray);
      maxDepth = twigletService['setDepths'](linkSourceMap, linkTargetMap);
    });

    it('returns the correct max depth (max depth with at most 1 more layer)', () => {
      expect(maxDepth).toEqual(2);
    });

    it('sets origin to depth 0', () => {
      const nodes = twigletService['allNodes'];
      const topLevelNodes = Reflect.ownKeys(nodes)
                            .map(key => nodes[key])
                            .filter(node => node.id.startsWith('node0.0'));
      expect(topLevelNodes.every(node => node.depth === 0)).toEqual(true);
    });

    it('does not assign a depth to unattached nodes', () => {
      const nodes = twigletService['allNodes'];
      const topLevelNodes = Reflect.ownKeys(nodes)
                            .map(key => nodes[key])
                            .filter(node => node.id.startsWith('node0.1'));
      expect(topLevelNodes.every(node => node.depth === undefined || node.depth === null)).toEqual(true);
    });

    it('sets the middle layer to a depth of 1', () => {
      const nodes = twigletService['allNodes'];
      const topLevelNodes = Reflect.ownKeys(nodes)
                            .map(key => nodes[key])
                            .filter(node => node.id.startsWith('node1.'));
      expect(topLevelNodes.every(node => node.depth === 1)).toEqual(true);
    });

    it('sets the last layer to a depth of 2', () => {
      const nodes = twigletService['allNodes'];
      const topLevelNodes = Reflect.ownKeys(nodes)
                            .map(key => nodes[key])
                            .filter(node => node.id.startsWith('node2.'));
      expect(topLevelNodes.every(node => node.depth === 2)).toEqual(true);
    });
  });

  describe('getFilteredNodesAndLinks', () => {
    function nodesAndLinks(): { nodes: { [key: string]: D3Node }, links: { [key: string]: Link } } {
      const nodes = {
        'node0.0': { id: 'node0.0', type: 'ent1' },
        'node0.1': { id: 'node0.1', type: 'ent1' },
        'node1.0': { id: 'node1.0', type: 'ent1' },
        'node1.1': { id: 'node1.1', type: 'ent1' },
        'node2.0': { id: 'node2.0', type: 'ent2' },
        'node2.1': { id: 'node2.1', type: 'ent2' },
        'node2.2': { id: 'node2.2', type: 'ent2' },
        'node2.3': { id: 'node2.3', type: 'ent2' },
      };
      const links = {
        'link0.0-1.0': { id: 'link0.0-1.0', source: 'node0.0', target: 'node1.0' },
        'link0.0-1.1': { id: 'link0.0-1.1', source: 'node0.0', target: 'node1.1' },
        'link1.0-2.0': { id: 'link1.0-2.0', source: 'node1.0', target: 'node2.0' },
        'link1.0-2.1': { id: 'link1.0-2.1', source: 'node1.0', target: 'node2.1' },
        'link1.1-2.2': { id: 'link1.1-2.2', source: 'node1.1', target: 'node2.2' },
        'link1.1-2.3': { id: 'link1.1-2.3', source: 'node1.1', target: 'node2.3' },
        'link2.0-1.0': { id: 'link2.0-1.0', source: 'node2.0', target: 'node1.0' },
        'link2.1-1.1': { id: 'link2.1-1.1', source: 'node2.1', target: 'node1.1' },
        'link2.1-2.3': { id: 'link2.1-2.3', source: 'node2.1', target: 'node2.3' },
        'link2.3-2.1': { id: 'link2.3-2.1', source: 'node2.3', target: 'node2.1' },
      };
      return { nodes, links };
    }

    beforeEach(() => {
      twigletService['viewData'] = fromJS({
        [VIEW.DATA]: {
          [VIEW_DATA.FILTERS]: [],
          [VIEW_DATA.LEVEL_FILTER]: '-1',
        }
      });
      const { nodes, links } = nodesAndLinks();
      twigletService['allNodes'] = nodes;
      twigletService['allLinks'] = links;
    });

    it('calls setLevelFilterMax', () => {
      twigletService['getFilteredNodesAndLinks']();
      expect(twigletService['userStateService'].setLevelFilterMax).toHaveBeenCalledWith(2);
    });

    it('returns all of the nodes if there are no filters', () => {
      const { nodes } = twigletService['getFilteredNodesAndLinks']();
      expect(nodes.length).toEqual(8);
    });

    it('filters the nodes based on type', () => {
      twigletService['viewData'] = fromJS({
        [VIEW.DATA]: {
          [VIEW_DATA.FILTERS]: [{ type: 'ent1' }],
          [VIEW_DATA.LEVEL_FILTER]: '-1'
        }
      });
      const { nodes } = twigletService['getFilteredNodesAndLinks']();
      expect(nodes.length).toEqual(4);
    });

    it('filters the nodes based on depth', () => {
      twigletService['viewData'] = fromJS({
        [VIEW.DATA]: {
          [VIEW_DATA.FILTERS]: [],
          [VIEW_DATA.LEVEL_FILTER]: '1'
        }
      });
      const { nodes } = twigletService['getFilteredNodesAndLinks']();
      expect(nodes.length).toEqual(3);
    });

    it('returns all of the links if there are no filters', () => {
      const { links } = twigletService['getFilteredNodesAndLinks']();
      expect(links.length).toEqual(10);
    });

    it('filters the links based on node type', () => {
      twigletService['viewData'] = fromJS({
        [VIEW.DATA]: {
          [VIEW_DATA.FILTERS]: [{ type: 'ent1' }],
          [VIEW_DATA.LEVEL_FILTER]: '-1'
        }
      });
      const { links } = twigletService['getFilteredNodesAndLinks']();
      expect(links.length).toEqual(2);
    });

    it('filters the nodes based on depth', () => {
      twigletService['viewData'] = fromJS({
        [VIEW.DATA]: {
          [VIEW_DATA.FILTERS]: [],
          [VIEW_DATA.LEVEL_FILTER]: '1'
        }
      });
      const { links } = twigletService['getFilteredNodesAndLinks']();
      expect(links.length).toEqual(2);
    });
  });

  describe('Collapse and Flower', () => {
    beforeEach(async(() => {
      twigletService['allNodes'] = {
        child1: { id: 'child1' },
        child2: { id: 'child2' },
        grandChild1: { id: 'grandChild1' },
        grandChild2: { id: 'grandChild2' },
        grandChild3: { id: 'grandChild3' },
        greatGrandChild1: { id: 'greatGrandChild1'},
        parent: { id: 'parent' },
      };
      twigletService['allLinks'] = {
        'child1-grandChild1': { id: 'child1-grandChild1', source: 'child1', target: 'grandChild1'},
        'child1-grandChild2': { id: 'child1-grandChild2', source: 'child1', target: 'grandChild2'},
        'child1-grandChild3': { id: 'child1-grandChild3', source: 'child1', target: 'grandChild3'},
        'grandChild1-greatGrandChild1': { id: 'grandChild1-greatGrandChild1', source: 'grandChild1', target: 'greatGrandChild1' },
        'parent-child1': { id: 'parent-child1', source: 'parent', target: 'child1'},
        'parent-child2': { id: 'parent-child2', source: 'parent', target: 'child2'},
      };
      twigletService['_nodeLocations'].next({
        child1: { },
        child2: { },
        grandChild1: { },
        grandChild2: { },
        grandChild3: { },
        greatGrandChild1: { },
        parent: { },
      });
    }));

    describe('NOT cascading collapse', () => {
      describe('collapsing a group of nodes - 1 generation deep', () => {
        let nodes: { [key: string]: D3Node };
        beforeEach(async(() => {
          twigletService.collapseNode('child1');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
          });
        }));

        it('toggles the child1 node as collapsed', () => {
          expect(nodes.child1.collapsed).toBeTruthy();
        });

        it('notes that child1 was not collapsed automatically', () => {
          expect(nodes.child1.collapsedAutomatically).toBe(false);
        });

        it('marks all the grandchild nodes as hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('grandChild'))
            .map(id => nodes[id])
            .every(node => node.hidden === true)
          ).toBeTruthy();
        });

        it('notes that all of the grandchildren were collapsed automatically', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('grandChild'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === true)
          ).toBeTruthy();
        });
      });

      describe('flowering a group of nodes - 1 generation deep', () => {
        let nodes: { [key: string]: D3Node };
        beforeEach(async(() => {
          twigletService.collapseNode('child1');
          twigletService.flowerNode('child1');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
          });
        }));

        it('marks the collapsed tag as false on child1 node', () => {
          expect(nodes.child1.collapsed).toBe(false);
        });

        it('removes the collapsed automatically tag from the child1 node', () => {
          expect(nodes.child1.collapsedAutomatically).toBe(undefined);
        });

        it('marks all the grandchild nodes as hidden = false', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('grandChild'))
            .map(id => nodes[id])
            .every(node => node.hidden === false)
          ).toBeTruthy();
        });

        it('removes the collapsed automatically tag from the grandchildren nodes', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('grandChild'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === undefined)
          ).toBeTruthy();
        });
      });

      describe('collapsing a group of nodes - 2 generations deep', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };
        beforeEach(async(() => {
          twigletService.collapseNode('parent');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('toggles the parent node as collapsed', () => {
          expect(nodes.parent.collapsed).toBeTruthy();
        });

        it('notes that parent was not collapsed automatically', () => {
          expect(nodes.parent.collapsedAutomatically).toBe(false);
        });

        it('marks all the child nodes as hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === true)
          ).toBeTruthy();
        });

        it('notes that all of the children were collapsed automatically', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === true)
          ).toBeTruthy();
        });

        it('remaps the source of child -> grandchild links to parent -> grandchild links', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('-grandchild'))
            .map(id => links[id])
            .every(link => (<D3Node>link.source).id === 'parent')
          ).toBeTruthy();
        });

        it('saves the original source of the child -> grandchild links so they can be restored', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('-grandchild'))
            .map(id => links[id])
            .every(link => link.sourceOriginal[0] === 'child1')
          ).toBeTruthy();
        });
      });

      describe('flowering a group of nodes - 2 generations deep', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };
        beforeEach(async(() => {
          twigletService.collapseNode('parent');
          twigletService.flowerNode('parent');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('toggles the parent node as not collapsed', () => {
          expect(nodes.parent.collapsed).toBe(false);
        });

        it('removes the collapsed automatically tag on the parent', () => {
          expect(nodes.parent.collapsedAutomatically).toBe(undefined);
        });

        it('marks all of the children hidden = false', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === false)
          ).toBeTruthy();
        });

        it('removes the collapsed automatically tag from all of the children nodes', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.collapsed === undefined)
          ).toBeTruthy();
        });

        it('remaps the source of parent -> grandchild links back to child1 -> grandchild links', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('-grandchild'))
            .map(id => links[id])
            .every(link => (<D3Node>link.source).id === 'child1')
          ).toBeTruthy();
        });

        it('deletes the sourceOriginal tag as it is no longer needed', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.includes('-grandchild'))
            .map(id => links[id])
            .every(link => link.sourceOriginal === undefined)
          ).toBeTruthy();
        });
      });

      describe('it can collapse through multiple levels', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };
        beforeEach(async(() => {
          twigletService.collapseNode('child1');
          twigletService.collapseNode('parent');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('links the parent to the great-grandchild', () => {
          expect(links['grandChild1-greatGrandChild1'].source).toEqual('parent');
        });

        it('keeps a history of the collapsing', () => {
          expect(links['grandChild1-greatGrandChild1'].sourceOriginal).toEqual(['grandChild1', 'child1']);
        });
      });

      describe('it can flower through multiple levels', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };
        beforeEach(async(() => {
          twigletService.collapseNode('child1');
          twigletService.collapseNode('parent');
          twigletService.flowerNode('parent');
          twigletService.flowerNode('child1');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('restores the links', () => {
          expect(links['grandChild1-greatGrandChild1'].source).toEqual('grandChild1');
        });

        it('removes the history of the collapsing', () => {
          expect(links['grandChild1-greatGrandChild1'].sourceOriginal).toEqual([]);
        });
      });
    });

    describe('Cascading Collapse', () => {
      describe('Collapse', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };
        beforeEach(async(() => {
          twigletService.collapseNodeCascade('parent');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('toggles the parent node as collapsed', () => {
          expect(nodes.parent.collapsed).toBeTruthy();
        });

        it('notes that parent was not collapsed automatically', () => {
          expect(nodes.parent.collapsedAutomatically).toBeUndefined();
        });

        it('marks all the child nodes as hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === true)
          ).toBeTruthy();
        });

        it('marks all of the grandChild nodes as hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === true)
          ).toBeTruthy();
        });

        it('notes that all of the children were collapsed automatically', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === true)
          ).toBeTruthy();
        });

        it('nodes that all of the grandChildren were collapsed automatically', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('grandChild'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === true)
          ).toBeTruthy();
        });

        it('does not modify any of the link sources', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.source === link.id.split('-')[0])
          ).toBeTruthy();
        });

        it('does not modify any of the link targets', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.target === link.id.split('-')[1])
          ).toBeTruthy();
        });

        it('does not create any sourceOriginals', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.sourceOriginal === undefined)
          ).toBeTruthy();
        });

        it('does not create any targetOriginals', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.targetOriginal === undefined)
          ).toBeTruthy();
        });
      });

      describe('flowering', () => {
        let nodes: { [key: string]: D3Node };
        let links: { [key: string]: Link };

        beforeEach(async(() => {
          twigletService.collapseNodeCascade('parent');
          twigletService.flowerNodeCascade('parent');
          twigletService.observable.subscribe(twiglet => {
            nodes = twiglet.get(TWIGLET.NODES).toJS();
            links = twiglet.get(TWIGLET.LINKS).toJS();
          });
        }));

        it('marks the parent as uncollapsed', () => {
          expect(nodes.parent.collapsed).toBe(false);
        });

        it('notes that parent was not collapsed automatically', () => {
          expect(nodes.parent.collapsedAutomatically).toBeUndefined();
        });

        it('marks all the child nodes as not hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === false)
          ).toBeTruthy();
        });

        it('marks all of the grandChild nodes as not hidden', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.hidden === false)
          ).toBeTruthy();
        });

        it('removes the collapsedAutomatically key on the children', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('child'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === undefined)
          ).toBeTruthy();
        });

        it('removes the collapsedAutomatically key on the grandchildren', () => {
          expect(
            Reflect.ownKeys(nodes)
            .filter((id: string) => id.startsWith('grandChild'))
            .map(id => nodes[id])
            .every(node => node.collapsedAutomatically === undefined)
          ).toBeTruthy();
        });

        it('does not modify any of the link sources', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.source === link.id.split('-')[0])
          ).toBeTruthy();
        });

        it('does not modify any of the link targets', () => {
          expect(
            Reflect.ownKeys(links)
            .map(id => links[id])
            .every(link => link.target === link.id.split('-')[1])
          ).toBeTruthy();
        });
      });
    });
  });
});
