import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { clone } from 'ramda';

import { ChangeLogService } from './../changelog/changelog.service';
import { successfulMockBackend, mockToastr } from '../../testHelpers';
import { TwigletService } from './index';
import { UserState } from './../../interfaces/userState/index';
import { ViewService } from './view.service';
import VIEW from './constants/view';
import VIEW_DATA from './constants/view/data';

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


describe('ViewService', () => {
  let viewService: ViewService;
  const parentBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userStateBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userState = {
    loadUserState: jasmine.createSpy('loadUserState').and.returnValue(Observable.of('success')),
    observable: userStateBs.asObservable(),
    startSpinner() {},
    stopSpinner() {},
  };
  const parent = {
    nodeLocations: Observable.of(fromJS([])),
    observable: parentBs,
  };
  let http;
  let fakeToastr;
  beforeEach(() => {
    userState.loadUserState = jasmine.createSpy('loadUserState').and.returnValue(Observable.of('success'));
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    fakeToastr = mockToastr();
    viewService = new ViewService(http, parent as any, fakeToastr);
  });

  describe('observable', () => {
    it('returns an observable with a list of views', () => {
      viewService.views.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('refreshViews', () => {
    it('does not refreshes the views if no url provided', () => {
      spyOn(http, 'get');
      viewService.refreshViews();
      expect(http.get).not.toHaveBeenCalled();
    });

    it('refreshes the views if there is a view url', () => {
      parentBs.next(fromJS({ name: 'some name', views_url: '/views'}));
      viewService.refreshViews();
      viewService.views.subscribe(response => {
        expect(response.toJS()).toEqual(views());
      });
    });
  });

  describe('loadView', () => {
    let get;
    beforeEach(() => {
      get = spyOn(http, 'get').and.callThrough();
    });

    it('returns an error if the view does not exist', () => {
      viewService.loadView('/twiglet/name1/views', 'view3').subscribe(response => {
        expect('this should never be called').toEqual('ever');
      }, error => {
        expect(error).not.toBe(null);
      });
    });

    it('loads the view if the view exists', () => {
      viewService.loadView('/twiglet/name1/views', 'view1').subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('createView', () => {
    let post: jasmine.Spy;
    function userStateGen() {
      return {
        autoConnectivity: 'keep',
        cascadingCollapse: 'keep',
        currentNode: 'keep',
        extra: 'trash',
        filters: [{
          attributes: ['some attributes'],
          types: { other: 'types' }
        }],
        forceChargeStrength: 'keep',
        forceGravityX: 'keep',
        forceGravityY: 'keep',
        forceLinkDistance: 'keep',
        forceLinkStrength: 'keep',
        forceVelocityDecay: 'keep',
        linkType: 'keep',
        scale: 'keep',
        showLinkLabels: 'keep',
        showNodeLabels: 'keep',
        traverseDepth: 'keep',
        treeMode: 'keep',
      };
    }
    beforeEach(() => {
      userStateBs.next(fromJS(userStateGen()));
      parentBs.next(fromJS({
        links: {
          link1: {
            association: 'link 1 name',
            id: 'link1',
            source: 'node2',
            sourceOriginal: 'node1',
            target: 'node4',
            targetOriginal: 'node3',
          },
          link2: {
            association: 'link 2 name',
            id: 'link2',
            source: 'node1',
            target: 'node3',
          }
        },
        name: 'name1',
      }));
    });

    it('puts an empty filter in if the filters do not exist', () => {
      post = spyOn(http, 'post').and.callThrough();
      const tempUserState = userStateGen();
      tempUserState.filters = [];
      userStateBs.next(fromJS(tempUserState));
      viewService.createView('name', 'description').subscribe(response => {
        expect(post.calls.argsFor(0)[1].userState.filters).toEqual([{
          attributes: [],
          types: { }
        }]);
      });
    });

    describe('setting data values', () => {
      describe('setAlphaTarget', () => {
        it('can be set', () => {
          viewService.setAlphaTarget(1.2);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.ALPHA_TARGET])).toEqual(1.2);
          });
        });
      });

      describe('setAutoConnectivity', () => {
        it('can be set', () => {
          viewService.setAutoConnectivity('both');
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.AUTO_CONNECTIVITY])).toEqual('both');
          });
        });
      });

      describe('setCascadingCollapse', () => {
        it('can be set', () => {
          viewService.setCascadingCollapse(true);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.CASCADING_COLLAPSE])).toEqual(true);
          });
        });
      });

      describe('setCollisionDistance', () => {
        it('can be set', () => {
          const distance = 10;
          viewService.setCollisionDistance(distance);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.COLLISION_DISTANCE])).toEqual(distance);
          });
        });
      });

      describe('setForceChargeStrength', () => {
        it('can be set', () => {
          const strength = 200;
          viewService.setForceChargeStrength(strength);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_CHARGE_STRENGTH])).toEqual(strength);
          });
        });
      });

      describe('setForceGravityX', () => {
        it('can be set', () => {
          const strength = 200;
          viewService.setForceGravityX(strength);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_GRAVITY_X])).toEqual(strength);
          });
        });
      });

      describe('setForceGravityY', () => {
        it('can be set', () => {
          const strength = 200;
          viewService.setForceGravityY(strength);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_GRAVITY_Y])).toEqual(strength);
          });
        });
      });

      describe('setForceLinkDistance', () => {
        it('can be set', () => {
          const distance = 200;
          viewService.setForceLinkDistance(distance);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_LINK_DISTANCE])).toEqual(distance);
          });
        });
      });

      describe('setForceLinkStrength', () => {
        it('can be set', () => {
          const strength = 200;
          viewService.setForceLinkStrength(strength);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_LINK_STRENGTH])).toEqual(strength);
          });
        });
      });

      describe('setForceVelocityDecay', () => {
        it('can be set', () => {
          const decay = 200;
          viewService.setForceVelocityDecay(decay);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FORCE_VELOCITY_DECAY])).toEqual(decay);
          });
        });
      });

      describe('setLinkType', () => {
        it('can be set', () => {
          const linkType = 'line';
          viewService.setLinkType(linkType);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.LINK_TYPE])).toEqual(linkType);
          });
        });
      });

      describe('setLevelFilter', () => {
        it('can be set', () => {
          const level = 10;
          viewService.setLevelFilter(level);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER])).toEqual(level);
          });
        });
      });

      describe('setRenderOnEveryTick', () => {
        it('can be set', () => {
          viewService.setRenderOnEveryTick(false);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.RENDER_ON_EVERY_TICK])).toEqual(false);
          });
        });
      });

      describe('setRunSimulation', () => {
        it('can be set', () => {
          viewService.setRunSimulation(false);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.RUN_SIMULATION])).toEqual(false);
          });
        });
      });

      describe('setFilter', () => {
        it('can be set', () => {
          const filter = { some: 'filter' };
          viewService.setFilter(filter);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.FILTERS])).toEqual(fromJS(filter));
          });
        });
      });

      describe('setScale', () => {
        it('can be set', () => {
          const scale = 10;
          viewService.setScale(scale);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.SCALE])).toEqual(scale);
          });
        });
      });

      describe('setSeparation', () => {
        it('can be set', () => {
          const distance = 10;
          viewService.setSeparationDistance(distance);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.SEPARATION_DISTANCE])).toEqual(distance);
          });
        });
      });

      describe('setShowNodeLabels', () => {
        it('can be set', () => {
          viewService.setShowNodeLabels(true);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.SHOW_NODE_LABELS])).toEqual(true);
          });
        });
      });

      describe('setShowLinkLabels', () => {
        it('can be set', () => {
          viewService.setShowLinkLabels(true);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.SHOW_LINK_LABELS])).toEqual(true);
          });
        });
      });

      describe('setTreeMode', () => {
        it('can be set', () => {
          viewService.setTreeMode(true);
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.TREE_MODE])).toEqual(true);
          });
        });
      });

      it('gravity points can be set', () => {
        const gravityPoint = { id: { id: 'id', name: 'name', x: 200, y: 200 } };
        viewService.setGravityPoints(gravityPoint);
        viewService.observable.subscribe(response => {
          expect(response.getIn([VIEW.DATA, VIEW_DATA.GRAVITY_POINTS]).toJS()).toEqual(gravityPoint);
        });
      });

      describe('adding a gravity point', () => {
        const gravityPoint = {
          id: 'id',
          name: 'name',
          x: 100,
          y: 100
        };

        beforeEach(() => {
          viewService.setGravityPoint(gravityPoint);
        });

        it('can add a gravity point', () => {
          viewService.observable.subscribe(response => {
            expect(response.getIn([VIEW.DATA, VIEW_DATA.GRAVITY_POINTS]).toJS()).toEqual({ id: gravityPoint });
          });
        });

        it('renames a gravity point if id matches', () => {
          viewService.setGravityPoint({
            id: 'id',
            name: 'new name',
            x: 100,
            y: 100
          });
          viewService.observable.subscribe(response => {
            const newName = clone(gravityPoint);
            newName.name = 'new name';
            expect(response.getIn([VIEW.DATA, VIEW_DATA.GRAVITY_POINTS]).toJS()).toEqual({ id: newName });
          });
        });
      });
    });

    describe('sanitizing the links', () => {
      beforeEach(() => {
        viewService.createView('name', 'description');
      });

      it('keeps source', () => {
        expect(post.calls.argsFor(0)[1].links.link1.source).toEqual('node2');
      });

      it('keeps sourceOriginal', () => {
        expect(post.calls.argsFor(0)[1].links.link1.sourceOriginal).toEqual('node1');
      });

      it('keeps target', () => {
        expect(post.calls.argsFor(0)[1].links.link1.target).toEqual('node4');
      });

      it('keeps targetOriginal', () => {
        expect(post.calls.argsFor(0)[1].links.link1.targetOriginal).toEqual('node3');
      });

      it('removes everything else', () => {
        expect(post.calls.argsFor(0)[1].links.link1.association).toBe(undefined);
      });
    });

    it('calls post', () => {
      post = spyOn(http, 'post').and.callThrough();
      viewService.createView('name', 'description');
      expect(http.post).toHaveBeenCalled();
    });

    it('refreshes the list of views', () => {
      spyOn(viewService, 'refreshViews').and.callThrough();
      viewService.createView('name', 'description').subscribe(response => {
        expect(viewService.refreshViews).toHaveBeenCalled();
      });
    });

    it('toasts success', () => {
      viewService.createView('name', 'description').subscribe(response => {
        expect(fakeToastr.success).toHaveBeenCalled();
      });
    });

    it('passes on the response', () => {
      viewService.createView('name', 'description').subscribe(response => {
        expect(response).toEqual(views());
      });
    });

    it('returns the error', () => {
      spyOn(console, 'error');
      spyOn(http, 'post').and.returnValue(Observable.throw('some http error'));
      viewService.createView('name', 'description').subscribe(response => {
        expect('this should never be called').toEqual('ever');
      }, error => {
        expect(error).toEqual('some http error');
      });
    });
  });

  describe('saveView', () => {

    it('calls put', () => {
      const put = spyOn(http, 'put').and.callThrough();
      viewService.saveView('/views/view1', 'name', 'description');
      expect(put).toHaveBeenCalled();
    });

    it('refreshes the list of views', () => {
      spyOn(viewService, 'refreshViews').and.callThrough();
      viewService.saveView('/views/view1', 'name', 'description').subscribe(response => {
        expect(viewService.refreshViews).toHaveBeenCalled();
      });
    });

    it('toasts success', () => {
      viewService.saveView('/views/view1', 'name', 'description').subscribe(response => {
        expect(fakeToastr.success).toHaveBeenCalled();
      });
    });

    it('passes on the response', () => {
      viewService.saveView('/views/view1', 'name', 'description').subscribe(response => {
        expect(response).toEqual(view());
      });
    });

    it('returns the error', () => {
      spyOn(console, 'error');
      spyOn(http, 'put').and.returnValue(Observable.throw('some http error'));
      viewService.saveView('/views/view1', 'name', 'description').subscribe(response => {
        expect('this should never be called').toEqual('ever');
      }, error => {
        expect(error).toEqual('some http error');
      });
    });
  });

  describe('deleteView', () => {
    it('calls delete', () => {
      const del = spyOn(http, 'delete').and.callThrough();
      viewService.deleteView('/views/view1');
      expect(del).toHaveBeenCalled();
    });

    it('refreshes the list of views', () => {
      spyOn(viewService, 'refreshViews').and.callThrough();
      viewService.deleteView('/views/view1').subscribe(response => {
        expect(viewService.refreshViews).toHaveBeenCalled();
      });
    });

    it('toasts success', () => {
      viewService.deleteView('/views/view1').subscribe(response => {
        expect(fakeToastr.success).toHaveBeenCalled();
      });
    });

    it('passes on the response', () => {
      viewService.deleteView('/views/view1').subscribe(response => {
        expect(response).toEqual(view());
      });
    });

    it('returns the error', () => {
      spyOn(console, 'error');
      spyOn(http, 'delete').and.returnValue(Observable.throw('some http error'));
      viewService.deleteView('/views/view1').subscribe(response => {
        expect('this should never be called').toEqual('ever');
      }, error => {
        expect(error).toEqual('some http error');
      });
    });
  });
});

