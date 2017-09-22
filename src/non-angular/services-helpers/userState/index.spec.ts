import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { clone } from 'ramda';

import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';
import { router } from '../../testHelpers';
import { successfulMockBackend } from './../../testHelpers';
import { UserState } from './../../interfaces/userState/index';
import { UserStateService } from './index';
import USERSTATE from './constants';

fdescribe('UserStateService', () => {
  const mockUserResponse = {
    user: {
      email: 'user@email.com',
      name: 'user@email.com'
    }
  };
  let http: Http;
  let userStateService: UserStateService;
  let instRouter;
  let close = jasmine.createSpy('close');
  let modalService = {
    open: jasmine.createSpy('open').and.returnValue({
      close
    })
  };

  beforeEach(() => {
    close = jasmine.createSpy('close');
    modalService = {
      open: jasmine.createSpy('open').and.returnValue({
        close
      })
    };
    instRouter = router();
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    userStateService = new UserStateService(http, instRouter as any, <any>modalService);
  });

  describe('router subscriptions', () => {
    it('correctly sets the mode to model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/model/someName', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.MODE)).toEqual('model');
      });
    });

    it('correctly sets the mode to twiglet', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/twiglet/someName', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.MODE)).toEqual('twiglet');
      });
    });

    it('correctly sets the mode to twiglet.model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/twiglet/someName/model', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.MODE)).toEqual('twiglet.model');
      });
    });

    it('correctly sets the mode to home', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      const event = new NavigationEnd(123, '/', 'whatever');
      bs.next(event);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.MODE)).toEqual('home');
      });
    });
  });

  describe('Observables', () => {
    it('returns an observable with the default values on subscription', () => {
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_NODE)).toBeFalsy();
        expect(response.get(USERSTATE.IS_EDITING)).toBeFalsy();
      });
    });
  });

  describe('resetAllDefaults', () => {

    let userState;

    const dirtyState = {
      addingGravityPoints: 'dirty',
      autoConnectivity: 'dirty',
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
      addingGravityPoints: 'dirty',
      autoConnectivity: 'in',
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
        expect(response.get(USERSTATE.USER)).toEqual(null);
      });
    });
  });

  describe('loginViaMothershipAd', () => {
    describe('success', () => {
      let post;
      let result;
      beforeEach(() => {
        post = spyOn(http, 'post').and.callThrough();
        spyOn(userStateService, 'setCurrentUser');
        userStateService.loginViaMothershipAd('jwt').subscribe(user => {
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
        userStateService.loginViaMothershipAd('jwt').subscribe(
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
      userStateService.setCurrentUser({ id: 'blah', name: 'blah' });
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.USER)).toEqual({ user: { id: 'blah', name: 'blah' } });
      });
    });
  });

  describe('setCurrentEvent', () => {
    it('can be set', () => {
      const eventId = 'eventId'
      userStateService.setCurrentEvent(eventId);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_EVENT)).toEqual(eventId);
      });
    });
  });


  describe('currentNode', () => {
    const nodeId = 'nodeId';
    it('can set the current node', () => {
      userStateService.setCurrentNode(nodeId);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_NODE)).toEqual(nodeId);
      });
    });

    it('can set the copied node id to the current node id', () => {
      userStateService.setCurrentNode(nodeId);
      userStateService.setCopiedNodeId();
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.COPIED_NODE_ID)).toEqual(nodeId);
      });
    });

    it('can clear the current node', () => {
      // setup
      userStateService.setCurrentNode(nodeId);

      userStateService.clearCurrentNode();
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_NODE)).toBeFalsy();
      });
    });
  });

  describe('currentViewName', () => {
    const viewName = 'viewName';
    it('can set the current View', () => {
      userStateService.setCurrentView(viewName);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_VIEW_NAME)).toEqual(viewName);
      });
    });

    it('can clear the current View', () => {
      userStateService.setCurrentView(viewName);
      userStateService.clearCurrentView();
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_VIEW_NAME)).toBeFalsy();
      });
    });
  });

  describe('isEditing', () => {
    it('can set the editing mode to a true', () => {
      userStateService.setEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.IS_EDITING)).toEqual(true);
      });
    });

    it('can set the editing mode to a false', () => {
      userStateService.setTwigletModelEditing(false);
      userStateService.setEditing(false);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.IS_EDITING)).toEqual(false);
        expect(response.get(USERSTATE.EDIT_TWIGLET_MODEL)).toEqual(false);
      });
    });
  });

  describe('setPlayingBack', () => {
    it('can be set', () => {
      userStateService.setPlayingBack(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.IS_PLAYING_BACK)).toEqual(true);
      });
    });
  });

  describe('setSimulating', () => {
    it('can be set', () => {
      userStateService.setSimulating(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.IS_SIMIULATING)).toEqual(true);
      });
    });
  });

  describe('setLevelFilterMax', () => {
    it('can be set', () => {
      const level = 10;
      userStateService.setLevelFilterMax(level);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.LEVEL_FILTER_MAX)).toEqual(level);
      });
    });
  });

  describe('setEventFilterText', () => {
    it('can be set', () => {
      const filterText = 'some text';
      userStateService.setEventFilterText(filterText);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.EVENT_FILTER_TEXT)).toEqual(filterText);
      });
    });
  });

  describe('setNodeTypeToBeAdded', () => {
    it('can set the current node type to be added', () => {
      const nodeType = 'a type';
      userStateService.setNodeTypeToBeAdded(nodeType);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.NODE_TYPE_TO_BE_ADDED)).toEqual(nodeType);
      });
    });
  });

  describe('setPlaybackInterval', () => {
    it('can set the playback interval', () => {
      const interval = 100.17;
      userStateService.setPlaybackInterval(interval);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.PLAYBACK_INTERVAL)).toEqual(interval);
      });
    });
  });

  describe('setMode', () => {
    it('can be set', () => {
      const mode = 'home';
      userStateService.setMode(mode);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.MODE)).toEqual(mode);
      });
    });
  });

  describe('setTextToFilterOn', () => {
    it('can be set', () => {
      const filterText = 'search term';
      userStateService.setTextToFilterOn(filterText);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.TEXT_TO_FILTER_ON)).toEqual(filterText);
      });
    });
  });

  describe('setFormValid', () => {
    it('can be set', () => {
      userStateService.setFormValid(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.FORM_VALID)).toEqual(true);
      });
    });
  });

  describe('setHighLightedNode', () => {
    it('can be set', () => {
      const nodeId = 'nodeId';
      userStateService.setHighLightedNode(nodeId);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.HIGHLIGHTED_NODE)).toEqual(nodeId);
      });
    });
  });

  describe('gravity', () => {
    it('gravity edit mode can be set', () => {
      userStateService.setGravityEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.IS_EDITING_GRAVITY)).toEqual(true);
      });
    });

    it('adding gravity points mode can be set', () => {
      userStateService.setAddGravityPoints(true);
      userStateService.observable.subscribe(response => {
        expect(response.get(USERSTATE.ADDING_GRAVITY_POINTS)).toEqual(true);
      });
    });
  });

  describe('startSpinner', () => {
    it('starts the spinner if it has not already been started', () => {
      userStateService.startSpinner();
      expect(modalService.open).toHaveBeenCalled();
    });

    it('does not start the spinner if it is already going', () => {
      userStateService.startSpinner();
      userStateService.startSpinner();
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopSpinner', () => {
    it('starts the spinner if it has not already been started', () => {
      userStateService.startSpinner();
      userStateService.stopSpinner();
      expect(close).toHaveBeenCalled();
    });

    it('does not start the spinner if it is already going', () => {
      expect(userStateService.stopSpinner()).toBe(false);
    });
  });
});
