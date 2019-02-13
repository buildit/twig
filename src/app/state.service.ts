import { Injectable, NgZone } from '@angular/core';
import { BaseRequestOptions, Http, Response, Headers, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { merge } from 'ramda';
import { BehaviorSubject ,  Observable } from 'rxjs';

import {
  ModelsService,
  UserStateService,
  TwigletService,
} from '../non-angular/services-helpers';
import { ModelService } from './../non-angular/services-helpers/twiglet/model.service';
import { Link, D3Node } from '../non-angular/interfaces/twiglet';

@Injectable()
export class StateService {
  private apiUrl: 'http://localhost:3000';
  public model: ModelsService;
  public twiglet: TwigletService;
  public userState: UserStateService;
  server = {};

  constructor(public http: Http,
              public toastr: ToastrService,
              public router: Router,
              public modalService: NgbModal,
              private ngZone: NgZone) {
    this.userState = new UserStateService(http, router, modalService);
    this.model = new ModelsService(http, toastr, router, modalService, true, this.userState);
    this.twiglet = new TwigletService(http, toastr, router, modalService, true, this.userState, this.ngZone);
  }
}
