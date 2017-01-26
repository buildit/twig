/* tslint:disable:no-unused-variable */

import { Router } from '@angular/router';
import { routerForTesting } from './app.router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { StateService } from './state.service';

describe('StateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        StateService,
        MockBackend,
        BaseRequestOptions,
        ToastsManager,
        {provide: Router, useValue: routerForTesting },
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
