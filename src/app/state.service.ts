import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node } from '../non-angular/interfaces/twiglet';
import {
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
  public model: ModelService;
  public userState: UserStateService;

  constructor(private http: Http) {
    this.twiglet = new TwigletService();
    this.userState = new UserStateService();
    this.model = new ModelService();
  }

  loadTwiglet(name) {
    this.userState.setCurrentTwiglet(name);
    this.http.get(this.apiUrl).map((res: Response) => res.json()).subscribe(response => {
      this.model.addModel(response[2].doc.data);
      this.twiglet.addNodes(response[3].doc.data);
      this.twiglet.addLinks(response[1].doc.data);
    });
  }
}

export class StateServiceStub {
  public twiglet: TwigletService;
  public userState: UserStateService;
  public model: ModelService;

  constructor() {
    this.twiglet = new TwigletServiceStub();
    this.userState = new UserStateService();
    this.model = new ModelServiceStub();
  }

  loadTwiglet() {

  }
}

