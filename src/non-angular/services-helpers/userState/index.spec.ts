import { NavigationEnd } from '@angular/router';
import { successfulMockBackend } from './../../testHelpers/mockBackEnd';
import { Observable } from 'rxjs/Rx';
import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';
import { router } from '../../testHelpers';
import { UserState } from './../../interfaces/userState/index';
import { UserStateService } from './index';

describe('UserStateService', () => {
  const mockUserResponse = {
    user: {
      email: 'user@email.com',
      name: 'user@email.com'
    }
  };
  let http: Http;
  let userStateService: UserStateService;
  let instRouter;

  beforeEach(() => {
    instRouter = router();
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    userStateService = new UserStateService(http, instRouter as any, null);
  });

  describe('router subscriptions', () => {
    it('correctly sets the mode to model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/model/someName', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('model');
      });
    });

    it('correctly sets the mode to twiglet', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/twiglet/someName', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('twiglet');
      });
    });

    it('correctly sets the mode to twiglet.model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/twiglet/someName/model', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('twiglet.model');
      });
    });
  });

  describe('Observables', () => {
    it('returns an observable with the default values on subscription', () => {
      userStateService.observable.subscribe(response => {
        expect(response.get('currentNode')).toBeFalsy();
        expect(response.get('isEditing')).toBeFalsy();
      });
    });
  });

  describe('resetAllDefaults', () => {

    let userState;

    const dirtyState = {
      activeModel: 'dirty',
      activeTwiglet: 'dirty',
      addingGravityPoints: 'dirty',
      autoConnectivity: 'dirty',
      autoScale: 'dirty',
      bidirectionalLinks: 'dirty',
      cascadingCollapse: 'dirty',
      copiedNodeId: 'dirty',
      currentNode: 'dirty',
      currentViewName: 'dirty',
      editTwigletModel: 'dirty',
      filters: 'dirty',
      forceChargeStrength: 'dirty',
      forceGravityX: 'dirty',
      forceGravityY: 'dirty',
      forceLinkDistance: 'dirty',
      forceLinkStrength: 'dirty',
      forceVelocityDecay: 'dirty',
      formValid: 'dirty',
      gravityPoints: 'dirty',
      highlightedNode: 'dirty',
      isEditing: 'dirty',
      isEditingGravity: 'dirty',
      linkType: 'dirty',
      mode: 'dirty',
      nodeSizingAutomatic: 'dirty',
      nodeTypeToBeAdded: 'dirty',
      ping: 'dirty',
      scale: 'dirty',
      showLinkLabels: 'dirty',
      showNodeLabels: 'dirty',
      textToFilterOn: 'dirty',
      traverseDepth: 'dirty',
      treeMode: 'dirty',
      user: 'dirty',
    };

    const cleanedState = {
      activeModel: 'dirty',
      activeTwiglet: 'dirty',
      addingGravityPoints: 'dirty',
      autoConnectivity: 'in',
      autoScale: 'linear',
      bidirectionalLinks: true,
      cascadingCollapse: false,
      copiedNodeId: 'dirty',
      currentNode: 'dirty',
      currentViewName: 'dirty',
      editTwigletModel: 'dirty',
      filters: Map({}),
      forceChargeStrength: 0.1,
      forceGravityX: 0.5,
      forceGravityY: 0.5,
      forceLinkDistance: 20,
      forceLinkStrength: 0.5,
      forceVelocityDecay: 0.9,
      formValid: 'dirty',
      gravityPoints: Map({}),
      highlightedNode: 'dirty',
      isEditing: 'dirty',
      isEditingGravity: 'dirty',
      linkType: 'path',
      mode: 'dirty',
      nodeSizingAutomatic: true,
      nodeTypeToBeAdded: 'dirty',
      ping: 'dirty',
      scale: 3,
      showLinkLabels: false,
      showNodeLabels: false,
      textToFilterOn: 'dirty',
      traverseDepth: 3,
      treeMode: false,
      user: 'dirty',
    };

    beforeAll((done) => {
      instRouter = router();
      userStateService = new UserStateService(new Http(successfulMockBackend, new BaseRequestOptions()), instRouter as any, null);
      userStateService['_userState'].next(fromJS(dirtyState));
      userStateService.resetAllDefaults();
      userStateService.observable.subscribe(_userState => {
        userState = _userState;
        done();
      });
    });

    Reflect.ownKeys(cleanedState).forEach(key => {
      const description = cleanedState[key] === 'dirty' ? `does not reset ${key}` : `resets ${key}`;
      it(description, () => {
        expect(userState.get(key)).toEqual(cleanedState[key]);
      });
    });
  });

  describe('logIn', () => {

    describe('success', () => {
      let post;
      let result;
      beforeEach(() => {
        post = spyOn(http, 'post').and.callThrough();
        spyOn(userStateService, 'setCurrentUser');
        userStateService.logIn({ some: 'body' }).subscribe(user => {
          result = user;
        });
      });

      it('posts to the correct url', () => {
        expect(post.calls.argsFor(0)[0].endsWith('/login')).toEqual(true);
      });

      it('sets the current user', () => {
        expect(userStateService.setCurrentUser).toHaveBeenCalled();
      });

      it('returns the user', () => {
        expect(result.name).not.toBeUndefined();
      });
    });

    describe('failure', () => {
      let post;
      let result;
      let error;
      beforeEach(() => {
        spyOn(console, 'error');
        post = spyOn(http, 'post').and.returnValue(Observable.throw(new Error('bad email')));
        spyOn(userStateService, 'setCurrentUser');
        userStateService.logIn({ some: 'body' }).subscribe(
        user => {
          result = user;
        },
        err => {
          error = err;
        });
      });

      it('does not set the current user', () => {
        expect(userStateService.setCurrentUser).not.toHaveBeenCalled();
      });

      it('does not succeed', () => {
        expect(result).toBeUndefined();
      });

      it('throws an error', () => {
        expect(error).not.toBeUndefined();
      });
    });
  });

  describe('logOut', () => {
    let post;
    beforeEach(() => {
      post = spyOn(http, 'post').and.callThrough();
      userStateService.logOut();
    });

    it('posts to the correct url', () => {
      expect(post.calls.argsFor(0)[0].endsWith('/logout')).toEqual(true);
    });

    it('sets the user to null', () => {
      userStateService.observable.subscribe(response => {
        expect(response.get('user')).toEqual(null);
      });
    });
  });

  describe('loginViaWiproAd', () => {
    describe('success', () => {
      let post;
      let result;
      beforeEach(() => {
        post = spyOn(http, 'post').and.callThrough();
        spyOn(userStateService, 'setCurrentUser');
        userStateService.loginViaWiproAd('jwt').subscribe(user => {
          result = user;
        });
      });

      it('posts to the correct url', () => {
        expect(post.calls.argsFor(0)[0].endsWith('/validateJwt')).toEqual(true);
      });

      it('sets the current user', () => {
        expect(userStateService.setCurrentUser).toHaveBeenCalled();
      });

      it('returns the user', () => {
        expect(result.name).not.toBeUndefined();
      });
    });

    describe('failure', () => {
      let post;
      let result;
      let error;
      beforeEach(() => {
        spyOn(console, 'error');
        post = spyOn(http, 'post').and.returnValue(Observable.throw(new Error('bad jwt or something')));
        spyOn(userStateService, 'setCurrentUser');
        userStateService.loginViaWiproAd('jwt').subscribe(
        user => {
          result = user;
        },
        err => {
          error = err;
        });
      });

      it('does not set the current user', () => {
        expect(userStateService.setCurrentUser).not.toHaveBeenCalled();
      });

      it('does not succeed', () => {
        expect(result).toBeUndefined();
      });

      it('throws an error', () => {
        expect(error).not.toBeUndefined();
      });
    });
  });

  describe('loadUserState', () => {
    let userState;

    const updatedUserState = {
      autoConnectivity: 'autoConnectivity',
      autoScale: 'autoScale',
      bidirectionalLinks: true,
      cascadingCollapse: true,
      currentNode: 'currentNode',
      filters: [],
      forceChargeStrength: 100,
      forceGravityX: 200,
      forceGravityY: 220,
      forceLinkDistance: 240,
      forceLinkStrength: 120,
      forceVelocityDecay: 180,
      gravityPoints: {},
      linkType: 'linkType',
      nodeSizingAutomatic: false,
      scale: 140,
      showLinkLabels: true,
      showNodeLabels: false,
      traverseDepth: 160,
      treeMode: true,
    };

    beforeAll((done) => {
      instRouter = router();
      userStateService = new UserStateService(new Http(successfulMockBackend, new BaseRequestOptions()), instRouter as any, null);
      userStateService.loadUserState(updatedUserState);
      userStateService.observable.subscribe(_userState => {
        userState = _userState;
        done();
      });
    });

    Reflect.ownKeys(updatedUserState).forEach(key => {
      it(`updates ${key} in the userState`, () => {
        expect(userState.get(key)).toEqual(fromJS(updatedUserState[key]));
      });
    });
  });

  describe('setCurrentUser', () => {
    it('can be set', () => {
      userStateService.setCurrentUser('blah');
      userStateService.observable.subscribe(response => {
        expect(response.get('user')).toEqual('blah');
      });
    });
  });

  describe('setActiveTab', () => {
    it('can be set', () => {
      userStateService.setActiveTab('blah');
      userStateService.observable.subscribe(response => {
        expect(response.get('activeTab')).toEqual('blah');
      });
    });
  });

  describe('setAlphaTarget', () => {
    it('can be set', () => {
      userStateService.setAlphaTarget(1.2);
      userStateService.observable.subscribe(response => {
        expect(response.get('alphaTarget')).toEqual(1.2);
      });
    });
  });

  describe('setAutoConnectivity', () => {
    it('can be set', () => {
      userStateService.setAutoConnectivity('both');
      userStateService.observable.subscribe(response => {
        expect(response.get('autoConnectivity')).toEqual('both');
      });
    });
  });

  describe('setAutoScale', () => {
    it('can be set', () => {
      userStateService.setAutoScale('power');
      userStateService.observable.subscribe(response => {
        expect(response.get('autoScale')).toEqual('power');
      });
    });
  });

  describe('setBidirectionalLinks', () => {
    it('can be set', () => {
      userStateService.setBidirectionalLinks(false);
      userStateService.observable.subscribe(response => {
        expect(response.get('bidirectionalLinks')).toEqual(false);
      });
    });
  });

  describe('setCascadingCollapse', () => {
    it('can be set', () => {
      userStateService.setCascadingCollapse(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('cascadingCollapse')).toEqual(true);
      });
    });
  });


  describe('currentNode', () => {
    it('can set the current node', () => {
      userStateService.setCurrentNode('node id');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentNode')).toEqual('node id');
      });
    });

    it('can set the copied node id to the current node id', () => {
      userStateService.setCurrentNode('node id');
      userStateService.setCopiedNodeId();
      userStateService.observable.subscribe(response => {
        expect(response.get('copiedNodeId')).toEqual('node id');
      });
    });

    it('can clear the current node', () => {
      // setup
      userStateService.setCurrentNode('node id');

      userStateService.clearCurrentNode();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentNode')).toBeFalsy();
      });
    });
  });

  describe('currentViewName', () => {
    it('can set the current View', () => {
      userStateService.setCurrentView('View name');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentViewName')).toEqual('View name');
      });
    });

    it('can clear the current View', () => {
      userStateService.setCurrentView('View name');

      userStateService.clearCurrentView();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentViewName')).toBeFalsy();
      });
    });
  });

  describe('setForceChargeStrength', () => {
    it('can be set', () => {
      userStateService.setForceChargeStrength(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceChargeStrength')).toEqual(200);
      });
    });
  });

  describe('setForceGravityX', () => {
    it('can be set', () => {
      userStateService.setForceGravityX(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceGravityX')).toEqual(200);
      });
    });
  });

  describe('setForceGravityY', () => {
    it('can be set', () => {
      userStateService.setForceGravityY(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceGravityY')).toEqual(200);
      });
    });
  });

  describe('setForceLinkDistance', () => {
    it('can be set', () => {
      userStateService.setForceLinkDistance(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceLinkDistance')).toEqual(200);
      });
    });
  });

  describe('setForceLinkStrength', () => {
    it('can be set', () => {
      userStateService.setForceLinkStrength(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceLinkStrength')).toEqual(200);
      });
    });
  });

  describe('setForceVelocityDecay', () => {
    it('can be set', () => {
      userStateService.setForceVelocityDecay(200);
      userStateService.observable.subscribe(response => {
        expect(response.get('forceVelocityDecay')).toEqual(200);
      });
    });
  });

  describe('isEditing', () => {
    it('can set the editing mode to a boolean', () => {
      userStateService.setEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditing')).toEqual(true);
      });
    });
  });

  describe('setLinkType', () => {
    it('can be set', () => {
      userStateService.setLinkType('line');
      userStateService.observable.subscribe(response => {
        expect(response.get('linkType')).toEqual('line');
      });
    });
  });

  describe('setNodeSizingAutomatic', () => {
    it('can be set', () => {
      userStateService.setNodeSizingAutomatic(false);
      userStateService.observable.subscribe(response => {
        expect(response.get('nodeSizingAutomatic')).toEqual(false);
      });
    });
  });

  describe('setNodeTypeToBeAdded', () => {
    it('can set the current node type to be added', () => {
      userStateService.setNodeTypeToBeAdded('a type');
      userStateService.observable.subscribe(response => {
        expect(response.get('nodeTypeToBeAdded')).toEqual('a type');
      });
    });
  });

  describe('setPlaybackInterval', () => {
    it('can set the playback interval', () => {
      userStateService.setPlaybackInterval(100.17);
      userStateService.observable.subscribe(response => {
        expect(response.get('playbackInterval')).toEqual(100.17);
      });
    });
  });

  describe('setMode', () => {
    it('can be set', () => {
      userStateService.setMode('some mode');
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('some mode');
      });
    });
  });

  describe('setFilter', () => {
    it('can be set', () => {
      userStateService.setFilter({ some: 'filter' });
      userStateService.observable.subscribe(response => {
        expect(response.get('filters')).toEqual(fromJS({ some: 'filter' }));
      });
    });
  });

  describe('setScale', () => {
    it('can be set', () => {
      userStateService.setScale(10);
      userStateService.observable.subscribe(response => {
        expect(response.get('scale')).toEqual(10);
      });
    });
  });

  describe('setSeparation', () => {
    it('can be set', () => {
      userStateService.setSeparationDistance(10);
      userStateService.observable.subscribe(response => {
        expect(response.get('separationDistance')).toEqual(10);
      });
    });
  });

  describe('setShowNodeLabels', () => {
    it('can be set', () => {
      userStateService.setShowNodeLabels();
      userStateService.observable.subscribe(response => {
        expect(response.get('showNodeLabels')).toEqual(true);
      });
    });
  });

  describe('setShowLinkLabels', () => {
    it('can be set', () => {
      userStateService.setShowLinkLabels();
      userStateService.observable.subscribe(response => {
        expect(response.get('showLinkLabels')).toEqual(true);
      });
    });
  });

  describe('setTextToFilterOn', () => {
    it('can be set', () => {
      userStateService.setTextToFilterOn('search term');
      userStateService.observable.subscribe(response => {
        expect(response.get('textToFilterOn')).toEqual('search term');
      });
    });
  });

  describe('setTreeMode', () => {
    it('can be set', () => {
      userStateService.setTreeMode(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('treeMode')).toEqual(true);
      });
    });
  });

  describe('setFormValid', () => {
    it('can be set', () => {
      userStateService.setFormValid(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('formValid')).toEqual(true);
      });
    });
  });

  describe('setHighLightedNode', () => {
    it('can be set', () => {
      userStateService.setHighLightedNode('some id');
      userStateService.observable.subscribe(response => {
        expect(response.get('highlightedNode')).toEqual('some id');
      });
    });
  });

  describe('gravity', () => {
    it('gravity edit mode can be set', () => {
      userStateService.setGravityEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditingGravity')).toEqual(true);
      });
    });

    it('adding gravity points mode can be set', () => {
      userStateService.setAddGravityPoints(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('addingGravityPoints')).toEqual(true);
      });
    });

    it('gravity points can be set', () => {
      userStateService.setGravityPoints({ id: { id: 'id', name: 'name', x: 200, y: 200 } });
      userStateService.observable.subscribe(response => {
        expect(response.get('gravityPoints').toJS()).toEqual({
          id: {
            id: 'id',
            name: 'name',
            x: 200,
            y: 200
          }
        });
      });
    });

    describe('adding a gravity point', () => {
      beforeEach(() => {
        userStateService.setGravityPoint({
          id: 'id',
          name: 'name',
          x: 100,
          y: 100
        });
      });

      it('can add a gravity point', () => {
        userStateService.observable.subscribe(response => {
          expect(response.get('gravityPoints').toJS()).toEqual({
            id: {
              id: 'id',
              name: 'name',
              x: 100,
              y: 100
            }
          });
        });
      });

      it('renames a gravity point if id matches', () => {
        userStateService.setGravityPoint({
          id: 'id',
          name: 'new name',
          x: 100,
          y: 100
        });
        userStateService.observable.subscribe(response => {
          expect(response.get('gravityPoints').toJS()).toEqual({
            id: {
              id: 'id',
              name: 'new name',
              x: 100,
              y: 100
            }
          });
        });
      });
    });
  });
});
