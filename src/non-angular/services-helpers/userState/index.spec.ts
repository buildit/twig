import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map, fromJS } from 'immutable';
import { UserState } from './../../interfaces/userState/index';
import { UserStateService } from './index';
import { router } from '../../testHelpers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';

describe('UserStateService', () => {
  const mockUserResponse = {
    user: {
      email: 'user@email.com',
      name: 'user@email.com'
    }
  };
  let mockBackend;
  let http: Http;
  let userStateService: UserStateService;
  let instRouter;

  beforeEach(() => {
    instRouter = router();
    mockBackend = new MockBackend();
    http = new Http(mockBackend, new BaseRequestOptions());
    userStateService = new UserStateService(http, instRouter as any, null);
  });

  describe('router subscriptions', () => {
    it('correctly sets the mode to model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      bs.next({ url: '/model/someName' });
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('model');
      });
    });

    it('correctly sets the mode to twiglet', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      bs.next({ url: '/twiglet/someName' });
      userStateService.observable.subscribe(response => {
        expect(response.get('mode')).toEqual('twiglet');
      });
    });

    it('correctly sets the mode to twiglet.model', () => {
      const bs = instRouter.behaviorSubject as BehaviorSubject<any>;
      bs.next({ url: '/twiglet/someName/model' });
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
      highlightedNode: 'dirty',
      isEditing: 'dirty',
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
      forceGravityX: 0.1,
      forceGravityY: 0.1,
      forceLinkDistance: 20,
      forceLinkStrength: 0.5,
      forceVelocityDecay: 0.9,
      formValid: 'dirty',
      highlightedNode: 'dirty',
      isEditing: 'dirty',
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
      mockBackend = new MockBackend();
      userStateService = new UserStateService(new Http(mockBackend, new BaseRequestOptions()), instRouter as any, null);
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
    let post;
    beforeEach(() => {
      post = spyOn(http, 'post').and.callThrough();
      userStateService.logIn({ some: 'body' });
    });

    it('posts to the correct url', () => {
      expect(post.calls.argsFor(0)[0].endsWith('/login')).toEqual(true);
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
      mockBackend = new MockBackend();
      userStateService = new UserStateService(new Http(mockBackend, new BaseRequestOptions()), instRouter as any, null);
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
});
