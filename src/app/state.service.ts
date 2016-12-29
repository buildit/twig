import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node } from '../non-angular/interfaces/twiglet';
import {
  ChangeLogService,
  ChangeLogServiceStub,
  LinksService,
  LinksServiceStub,
  ModelService,
  ModelServiceStub,
  NodesService,
  NodesServiceStub,
  UserStateService
} from '../non-angular/services-helpers';

@Injectable()
export class StateService {
  private apiUrl: string = 'http://localhost:3000';
  public twiglet: TwigletService;
  public userState: UserStateService;

  constructor(private http: Http) {
    this.twiglet = {
      changeLog: new ChangeLogService(),
      links: new LinksService(),
      model: new ModelService(),
      nodes: new NodesService(),
    };
    this.userState = new UserStateService();
  }

  loadTwiget(name) {
    this.userState.setCurrentTwiglet(name);
    this.http.get(this.apiUrl).map((res: Response) => res.json()).subscribe(response => {
      this.twiglet.model.addModel(response[2].doc.data);
      this.twiglet.nodes.addNodes(response[3].doc.data);
      this.twiglet.links.addLinks(response[1].doc.data);
    });
  }
}

export interface TwigletService {
  changeLog: ChangeLogService;
  links: LinksService;
  nodes: NodesService;
  model: ModelService;
}

export class StateServiceStub {
  public twiglet: TwigletService;
  public userState: UserStateService;

  constructor() {
    this.twiglet = {
      changeLog: new ChangeLogServiceStub(),
      links: new LinksServiceStub(),
      model: new ModelServiceStub(),
      nodes: new NodesServiceStub(),
    };
    this.userState = new UserStateService();
  }
}

