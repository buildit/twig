import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService,  } from 'ngx-toastr';

import { router } from '../non-angular/testHelpers';
import { routerForTesting } from './app.router';
import { StateService } from './state.service';
import SpyObj = jasmine.SpyObj;

describe('StateService', () => {
  let toastrServiceSpy: SpyObj<any>;
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
        { provide: ToastrService, useValue: toastrServiceSpy},
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
