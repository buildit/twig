import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node } from '../non-angular/interfaces/twiglet';
import { MockBackend } from '@angular/http/testing';
import {
  BackendService,
  BackendServiceStub,
  ChangeLogService,
  ChangeLogServiceStub,
  ModelService,
  ModelServiceStub,
  UserStateService,
  TwigletService,
  TwigletServiceStub,
} from '../non-angular/services-helpers';

@Injectable()
export class StateService {
  private apiUrl: string = 'http://localhost:3000';
  public twiglet: TwigletService;
  public userState: UserStateService;
  public backendService: BackendService;
  server = {};

  constructor(private http: Http, private toastr: ToastsManager, private router: Router) {
    this.userState = new UserStateService(http);
    this.twiglet = new TwigletService(http, this.userState, toastr, router);
    this.backendService = new BackendService(http);
  }

}

export class StateServiceStub {
  public twiglet: TwigletService;
  public userState: UserStateService;
  public backendService: BackendService;

  constructor(private http: Http = new Http(new MockBackend(), new BaseRequestOptions()),
              private toastr: ToastsManager = null, private router: Router = null) {
    this.userState = new UserStateService(http);
    this.twiglet = new TwigletServiceStub(http, this.userState, toastr, router);
    this.backendService = new BackendServiceStub(http);
  }

  loadTwiglet(id, name) {

  }

  getTwiglets() {
    return Observable.of([ { _id: 'id1', name: 'name1'}, { _id: 'id2', name: 'name2' } ]);
  }
}
