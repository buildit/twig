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

  loadTwiglet(id, name) {
    this.userState.setCurrentTwiglet(name);
    // this.http.get(this.apiUrl + '/twiglets/' + id).map((res: Response) => res.json()).subscribe(response => {
    //   this.http.get(response.model_url).map((resp: Response) => resp.json()).subscribe(model => {
    //     console.log(response.nodes);
    //     this.twiglet.clearLinks();
    //     this.twiglet.clearNodes();
    //     // this.model.clearModel();
    //     this.model.addModel(model.changelog);
    //     this.twiglet.addNodes(response.nodes);
    //     this.twiglet.addLinks(response.links);
    //   });
    // });
    let nodes = [];
    let links = [];
    this.getTwiglet(id).flatMap(data => {
      nodes = data.nodes;
      links = data.links;
      return this.getModel(data.model_url);
    }).subscribe(response => {
      console.log(links);
      console.log(nodes);
      this.twiglet.clearLinks();
      console.log(links);
      this.twiglet.clearNodes();
      this.model.addModel(response.changelog);
      this.twiglet.addNodes(nodes);
      this.twiglet.addLinks(links);
    });
  }

  getTwiglet(id) {
    return this.http.get(this.apiUrl + '/twiglets/' + id).map((res: Response) => res.json());
  }

  getModel(model_url) {
    return this.http.get(model_url).map((res: Response) => res.json());
  }

  getTwiglets() {
    return this.http.get(this.apiUrl + '/twiglets').map((res: Response) => res.json());
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
