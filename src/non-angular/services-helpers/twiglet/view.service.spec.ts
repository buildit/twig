import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ChangeLogService } from './../changelog/changelog.service';
import { successfulMockBackend, mockToastr } from '../../testHelpers';
import { TwigletService } from './index';
import { UserState } from './../../interfaces/userState/index';
import { ViewService } from './view.service';

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
    viewService = new ViewService(http, parent as any, userState as any, fakeToastr);
  });

  describe('observable', () => {
    it('returns an observable with a list of views', () => {
      viewService.observable.subscribe(response => {
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
      viewService.observable.subscribe(response => {
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
    function userState() {
      return {
        autoConnectivity: 'keep',
        autoScale: 'keep',
        bidirectionalLinks: 'keep',
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
        nodeSizingAutomatic: 'keep',
        scale: 'keep',
        showLinkLabels: 'keep',
        showNodeLabels: 'keep',
        traverseDepth: 'keep',
        treeMode: 'keep',
      };
    }
    beforeEach(() => {
      userStateBs.next(fromJS(userState()));
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
      const tempUserState = userState();
      tempUserState.filters = [];
      userStateBs.next(fromJS(tempUserState));
      viewService.createView('name', 'description').subscribe(response => {
        expect(post.calls.argsFor(0)[1].userState.filters).toEqual([{
          attributes: [],
          types: { }
        }]);
      });
    });

    describe('userState santizing', () => {
      beforeEach(() => {
        post = spyOn(http, 'post').and.callThrough();
        viewService.createView('name', 'description');
      });

      it('keeps the autoConnectivity Key', () => {
        expect(post.calls.argsFor(0)[1].userState.autoConnectivity).toEqual('keep');
      });

      it('keeps the autoScale Key', () => {
        expect(post.calls.argsFor(0)[1].userState.autoScale).toEqual('keep');
      });

      it('keeps the bidirectionalLinks Key', () => {
        expect(post.calls.argsFor(0)[1].userState.bidirectionalLinks).toEqual('keep');
      });

      it('keeps the cascadingCollapse Key', () => {
        expect(post.calls.argsFor(0)[1].userState.cascadingCollapse).toEqual('keep');
      });

      it('keeps the currentNode Key', () => {
        expect(post.calls.argsFor(0)[1].userState.currentNode).toEqual('keep');
      });

      it('keeps the filters Key', () => {
        expect(post.calls.argsFor(0)[1].userState.filters).toEqual([{
          attributes: ['some attributes'],
          types: { other: 'types' }
        }]);
      });

      it('keeps the forceChargeStrength Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceChargeStrength).toEqual('keep');
      });

      it('keeps the forceGravityX Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceGravityX).toEqual('keep');
      });

      it('keeps the forceGravityY Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceGravityY).toEqual('keep');
      });

      it('keeps the forceLinkDistance Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceLinkDistance).toEqual('keep');
      });

      it('keeps the forceLinkStrength Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceLinkStrength).toEqual('keep');
      });

      it('keeps the forceVelocityDecay Key', () => {
        expect(post.calls.argsFor(0)[1].userState.forceVelocityDecay).toEqual('keep');
      });

      it('keeps the linkType Key', () => {
        expect(post.calls.argsFor(0)[1].userState.linkType).toEqual('keep');
      });

      it('keeps the nodeSizingAutomatic Key', () => {
        expect(post.calls.argsFor(0)[1].userState.nodeSizingAutomatic).toEqual('keep');
      });

      it('keeps the scale Key', () => {
        expect(post.calls.argsFor(0)[1].userState.scale).toEqual('keep');
      });

      it('keeps the showLinkLabels Key', () => {
        expect(post.calls.argsFor(0)[1].userState.showLinkLabels).toEqual('keep');
      });

      it('keeps the showNodeLabels Key', () => {
        expect(post.calls.argsFor(0)[1].userState.showNodeLabels).toEqual('keep');
      });

      it('keeps the treeMode Key', () => {
        expect(post.calls.argsFor(0)[1].userState.treeMode).toEqual('keep');
      });

      it('keeps the traverseDepth Key', () => {
        expect(post.calls.argsFor(0)[1].userState.traverseDepth).toEqual('keep');
      });

      it('does not keep an extra keys', () => {
        expect(post.calls.argsFor(0)[1].userState.extra).toBe(undefined);
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

