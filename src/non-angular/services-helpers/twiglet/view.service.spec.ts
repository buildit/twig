import { successfulMockBackend, views, view, mockToastr } from '../../testHelpers';
import { UserState } from './../../interfaces/userState/index';
import { Map, fromJS } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewService } from './view.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TwigletService } from './index';


describe('ModelService', () => {
  let viewService: ViewService;
  let parentBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const parent = {
    observable: parentBs.asObservable(),
  };
  let userStateBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userState = {
    observable: userStateBs.asObservable(),
  };
  const http = new Http(successfulMockBackend, new BaseRequestOptions());
  let fakeToastr;
  beforeEach(() => {
    fakeToastr = mockToastr();
    viewService = new ViewService(http, parent, userState as any, fakeToastr);
  });

  describe('refreshViews', () => {
    it('only refreshes the views if there is a url', () => {
      spyOn(http, 'get');
      viewService.refreshViews();
      expect(http.get).not.toHaveBeenCalled();
    });

    it('refreshes the views if there is a view url', () => {
      parentBs.next(fromJS({ name: 'some name', viewsUrl: '/views'}));
      viewService.refreshViews();
      viewService.observable.subscribe(response => {
        expect(response.toJS()).toEqual(views());
      });
    });
  });

  describe('prepareViewForSending', () => {
    it('removes the key activeModel', () => {
      userStateBs.next(fromJS({ keep: 'this key', activeModel: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key activeTwiglet', () => {
      userStateBs.next(fromJS({ keep: 'this key', activeTwiglet: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key copiedNodeId', () => {
      userStateBs.next(fromJS({ keep: 'this key', copiedNodeId: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key currentViewName', () => {
      userStateBs.next(fromJS({ keep: 'this key', currentViewName: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key editTwigletModel', () => {
      userStateBs.next(fromJS({ keep: 'this key', editTwigletModel: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key formValid', () => {
      userStateBs.next(fromJS({ keep: 'this key', formValid: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key isEditing', () => {
      userStateBs.next(fromJS({ keep: 'this key', isEditing: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key mode', () => {
      userStateBs.next(fromJS({ keep: 'this key', mode: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key nodeTypeToBeAdded', () => {
      userStateBs.next(fromJS({ keep: 'this key', nodeTypeToBeAdded: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key textToFilterOn', () => {
      userStateBs.next(fromJS({ keep: 'this key', textToFilterOn: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });

    it('removes the key user', () => {
      userStateBs.next(fromJS({ keep: 'this key', user: 'gone' }));
      expect(viewService.prepareViewForSending()).toEqual({ keep: 'this key' });
    });
  });

  describe('createView', () => {
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
      viewService.saveView('views/view1', 'name', 'description');
      expect(http.put).toHaveBeenCalled();
    });

    it('refreshes the list of views', () => {
      spyOn(viewService, 'refreshViews').and.callThrough();
      viewService.saveView('views/view1', 'name', 'description').subscribe(response => {
        expect(viewService.refreshViews).toHaveBeenCalled();
      });
    });

    it('toasts success', () => {
      viewService.saveView('views/view1', 'name', 'description').subscribe(response => {
        expect(fakeToastr.success).toHaveBeenCalled();
      });
    });

    it('passes on the response', () => {
      viewService.saveView('views/view1', 'name', 'description').subscribe(response => {
        expect(response).toEqual(view());
      });
    });
  });
});

