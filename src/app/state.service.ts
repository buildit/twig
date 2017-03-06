import { ModelService } from './../non-angular/services-helpers/twiglet/model.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(public http: Http, public toastr: ToastsManager, public router: Router, public modalService: NgbModal) {
    this.userState = new UserStateService(http, router, modalService);
    this.model = new ModelsService(http, toastr, router, modalService, true, this.userState);
    this.twiglet = new TwigletService(http, toastr, router, modalService, true, this.userState);
  }
}
