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
  ChangeLogService,
  ModelService,
  ModelsService,
  UserStateService,
  TwigletService,
} from '../non-angular/services-helpers';

@Injectable()
export class StateService {
  private apiUrl: 'http://localhost:3000';
  public model: ModelsService;
  public twiglet: TwigletService;
  public userState: UserStateService;
  server = {};

  constructor(private http: Http, private toastr: ToastsManager, private router: Router) {
    this.userState = new UserStateService(http);
    this.model = new ModelsService(http, this.userState, toastr);
    this.twiglet = new TwigletService(http, this.userState, toastr);
  }
}
