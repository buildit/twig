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



describe('EventService', () => {
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
});
