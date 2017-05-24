import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map, List } from 'immutable';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs/Rx';

import { D3Node, Link } from '../../interfaces/twiglet';
import { mockToastr, successfulMockBackend } from '../../testHelpers';
import { StateCatcher } from '../index';
import { TwigletService } from './index';
import { UserStateService } from '../userState';

describe('twigletService', () => {
  const userStateBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userState = {
    observable: userStateBs.asObservable(),
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
    it('returns an observable with a name, description, nodes and links at initiation', () => {
      twigletService.observable.subscribe(response => {
        expect(response.size).toEqual(9);
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
      beforeEach(() => {
        twigletService.createBackup();
        twigletService['_twiglet'].next(Map({ a: 'twiglet' }));
        result = twigletService.restoreBackup();
      });

      it('restores the backup', () => {
        expect(twigletService.observable.subscribe(response => {
          expect(response.get('a')).toBe(undefined);
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
        expect(response.get(0).get('name')).toEqual('name1');
      });
    });
  });

  describe('clearCurrentTwiglet', () => {
    it('sets the current twiglet to a blank', () => {
      twigletService.clearCurrentTwiglet();
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get('name')).toEqual('');
      });
    });
  });

  describe('updateNodeTypes', () => {
    beforeEach((done) => {
      twigletService.loadTwiglet('name1').subscribe(response => {
        done();
      });
    });

    it('can update nodes types', () => {
      twigletService.updateNodeTypes('ent1', 'ent4');
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.getIn(['nodes', 'firstNode', 'type'])).toEqual('ent4');
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
        expect(twiglet.get('name')).toEqual('some name');
      });
    });
  });

  describe('setDescription', () => {
    it('can be set', () => {
      twigletService.setDescription('some description');
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get('description')).toEqual('some description');
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

      it('navigates to the new twiglet', () => {
        expect(router.navigate).toHaveBeenCalled();
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
              _body: JSON.stringify({ data: 'some twiglet' }),
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
          expect(twiglet.get('nodes').size).toEqual(4);
        });
      });
    });
  });

  describe('clearNodes', () => {
    it('clears all of the nodes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.clearNodes();
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get('nodes').size).toEqual(0);
        });
      });
    });
  });

  describe('updateNodeParam', () => {
    it('can update a specific parameter', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.updateNodeParam('firstNode', 'gravity', 'some id');
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn(['nodes', 'firstNode', 'gravity'])).toEqual('some id');
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
          expect(twiglet.getIn(['nodes', 'firstNode', 'name'])).toEqual('new name');
        });
      });
    });
  });

  describe('replaceNodesAndLinks', () => {
    it('can replace all of the nodes', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.replaceNodesAndLinks([{ id: 'an id' }], []);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get('nodes').size).toEqual(1);
        });
      });
    });

    it('can replace all of the links', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.replaceNodesAndLinks([], [{ id: 'an id', source: 'whatever', target: 'whatever' }]);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get('links').size).toEqual(1);
        });
      });
    });

    it('merges the node-positions if they exist', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.updateNodeViewInfo([{ id: 'an id', x: 100, y: 150 }]);
        twigletService.replaceNodesAndLinks([{ id: 'an id', x: 50, y: 75 }], []);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn(['nodes', 'an id', 'x'])).toEqual(100);
          expect(twiglet.getIn(['nodes', 'an id', 'y'])).toEqual(150);
        });
      });
    });
  });

  describe('updateNodeViewInfo', () => {
    it('stores the x position', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', x: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'x'])).toEqual(100);
      });
    });

    it('stores the y position', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', y: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'y'])).toEqual(100);
      });
    });

    it('stores the hidden attribute', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', hidden: true }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'hidden'])).toEqual(true);
      });
    });

    it('stores the hidden attribute', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', hidden: true }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'hidden'])).toEqual(true);
      });
    });

    it('stores the fx position', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', fx: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'fx'])).toEqual(100);
      });
    });

    it('stores the fy position', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', fy: 100 }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'fy'])).toEqual(100);
      });
    });

    it('stores the collapsed attribute', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', collapsed: true }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'collapsed'])).toEqual(true);
      });
    });

    it('stores the collapsedAutomatically attribute', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', collapsedAutomatically: true }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'collapsedAutomatically'])).toEqual(true);
      });
    });

    it('does not store any other attributes', () => {
      twigletService.updateNodeViewInfo([{ id: 'an id', type: 'ent1' }]);
      twigletService.nodeLocations.subscribe(nodes => {
        expect(nodes.getIn(['an id', 'type'])).toBe(undefined);
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
          expect(twiglet.get('nodes').size).toEqual(2);
          expect(twiglet.get('nodes').all(node => node.get('name') !== 'firstNodeName')).toBeTruthy();
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
          source: 'a source',
          target: 'a target',
        });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get('links').size).toEqual(3);
        });
      });
    });
  });

  describe('clearLinks', () => {
    it('clears all of the links', () => {
      twigletService.clearLinks();
      twigletService.observable.subscribe(twiglet => {
        expect(twiglet.get('links').size()).toEqual(0);
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
          source: 'a source',
          target: 'a target',
        }]);
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.getIn(['links', 'firstLink', 'association'])).toEqual('new association');
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
    it('can remove a Link', () => {
      twigletService.loadTwiglet('name1').subscribe(() => {
        twigletService.removeLink({ id: 'firstLink' });
        twigletService.observable.subscribe(twiglet => {
          expect(twiglet.get('links').size).toEqual(1);
          expect(twiglet.get('links').all(Link => Link.get('association') !== 'firstLink')).toBeTruthy();
        });
      });
    });
  });
});
