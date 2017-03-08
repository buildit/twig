import { Router } from '@angular/router';
import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { StateService } from './state.service';
import { router } from '../non-angular/testHelpers';
import { routerForTesting } from './app.router';

describe('StateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        NgbModule.forRoot(),
      ],
      providers: [
        NgbModal,
        StateService,
        MockBackend,
        BaseRequestOptions,
        ToastsManager,
        ToastOptions,
        {provide: Router, useValue: router() },
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
            return new Http(backend, options);
          },
        }
      ]
    });
  });

  it('should ...', inject([StateService], (service: StateService) => {
    expect(service).toBeTruthy();
  }));

});
