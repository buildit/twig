import { ChangeLogService } from './../changelog/changelog.service';
import { successfulMockBackend, mockToastr } from '../../testHelpers';
import { UserState } from './../../interfaces/userState/index';
import { Map, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ViewService } from './view.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TwigletService } from './index';

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
    observable: userStateBs.asObservable(),
    startSpinner() {},
    stopSpinner() {},
  };
  const parent = {
    nodeLocations: Observable.of(fromJS([])),
    observable: parentBs,
  };
  const http = new Http(successfulMockBackend, new BaseRequestOptions());
  let fakeToastr;
  beforeEach(() => {
    fakeToastr = mockToastr();
    viewService = new ViewService(http, parent as any, userState as any, fakeToastr);
  });

  describe('refreshViews', () => {
    it('only refreshes the views if there is a url', () => {
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

  describe('prepareViewForSending', () => {
    it('keeps the autoConnectivity Key', () => {
      userStateBs.next(fromJS({ autoConnectivity: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ autoConnectivity: '?' });
    });

    it('keeps the autoScale Key', () => {
      userStateBs.next(fromJS({ autoScale: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ autoScale: '?' });
    });

    it('keeps the bidirectionalLinks Key', () => {
      userStateBs.next(fromJS({ bidirectionalLinks: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ bidirectionalLinks: '?' });
    });

    it('keeps the cascadingCollapse Key', () => {
      userStateBs.next(fromJS({ cascadingCollapse: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ cascadingCollapse: '?' });
    });

    it('keeps the currentNode Key', () => {
      userStateBs.next(fromJS({ currentNode: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ currentNode: '?' });
    });

    it('keeps the filters Key', () => {
      userStateBs.next(fromJS({ filters: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ filters: '?' });
    });

    it('keeps the forceChargeStrength Key', () => {
      userStateBs.next(fromJS({ forceChargeStrength: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceChargeStrength: '?' });
    });

    it('keeps the forceGravityX Key', () => {
      userStateBs.next(fromJS({ forceGravityX: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceGravityX: '?' });
    });

    it('keeps the forceGravityY Key', () => {
      userStateBs.next(fromJS({ forceGravityY: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceGravityY: '?' });
    });

    it('keeps the forceLinkDistance Key', () => {
      userStateBs.next(fromJS({ forceLinkDistance: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceLinkDistance: '?' });
    });

    it('keeps the forceLinkStrength Key', () => {
      userStateBs.next(fromJS({ forceLinkStrength: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceLinkStrength: '?' });
    });

    it('keeps the forceVelocityDecay Key', () => {
      userStateBs.next(fromJS({ forceVelocityDecay: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ forceVelocityDecay: '?' });
    });

    it('keeps the linkType Key', () => {
      userStateBs.next(fromJS({ linkType: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ linkType: '?' });
    });

    it('keeps the nodeSizingAutomatic Key', () => {
      userStateBs.next(fromJS({ nodeSizingAutomatic: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ nodeSizingAutomatic: '?' });
    });

    it('keeps the scale Key', () => {
      userStateBs.next(fromJS({ scale: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ scale: '?' });
    });

    it('keeps the showLinkLabels Key', () => {
      userStateBs.next(fromJS({ showLinkLabels: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ showLinkLabels: '?' });
    });

    it('keeps the showNodeLabels Key', () => {
      userStateBs.next(fromJS({ showNodeLabels: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ showNodeLabels: '?' });
    });

    it('keeps the treeMode Key', () => {
      userStateBs.next(fromJS({ treeMode: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ treeMode: '?' });
    });

    it('keeps the traverseDepth Key', () => {
      userStateBs.next(fromJS({ traverseDepth: '?', trash: 'key' }));
      expect(viewService.prepareViewForSending()).toEqual({ traverseDepth: '?' });
    });
  });

  describe('createView', () => {
    beforeEach(() => {
      userStateBs.next(fromJS({ filters: {} }));
      parentBs.next(fromJS({
        links: [],
        name: 'name1',
      }));
    });

    it('calls post', () => {
      spyOn(http, 'post').and.callThrough();
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
  });

  describe('saveView', () => {
    it('calls put', () => {
      spyOn(http, 'put').and.callThrough();
      viewService.saveView('/views/view1', 'name', 'description');
      expect(http.put).toHaveBeenCalled();
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
  });
});

