import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node, Twiglet } from '../non-angular/interfaces/twiglet';
import {
  LinksService,
  LinksServiceStub,
  NodesService,
  NodesServiceStub,
  UserStateService
} from '../non-angular/services-helpers';

@Injectable()
export class StateService {
  public twiglet: TwigletService;
  public userState: UserStateService;

  constructor() {
    this.twiglet = {
      links: new LinksService(),
      nodes: new NodesService(),
    };
    this.userState = new UserStateService();
  }
}

export interface TwigletService {
  nodes: NodesService;
  links: LinksService;
}

export class StateServiceStub {
  public twiglet: TwigletService;
  public userState: UserStateService;

  constructor() {
    this.twiglet = {
      links: new LinksServiceStub(),
      nodes: new NodesServiceStub(),
    };
    this.userState = new UserStateService();
  }
}

