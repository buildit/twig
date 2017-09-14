import { Inject, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routerForTesting } from './../../app/app.router';
import { successfulMockBackend } from './mockBackEnd.spec';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BaseRequestOptions, Http, } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MockBackend } from '@angular/http/testing';
import { StateService } from '../../app/state.service';
const fakeNgZone = {
  runOutsideAngular (fn) {
    fn();
  }
};

export function stateServiceStub(mockBackend: MockBackend = successfulMockBackend) {
  const http = new Http(mockBackend, new BaseRequestOptions());
  return new StateService(http, null, router() as any, ngbModalStub() as any, fakeNgZone as NgZone);
};

export function ngbModalStub() {
  return {
    open: jasmine.createSpy('open').and.returnValue({ close: jasmine.createSpy('close')})
  };
}

export function router() {
  const routerEvents = new BehaviorSubject<any>({ url: '/' });
  return {
    behaviorSubject: routerEvents,
    events: routerEvents.asObservable(),
    navigate: jasmine.createSpy('navigate'),
  };
}
