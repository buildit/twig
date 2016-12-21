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
  ViewService
} from '../non-angular/services-helpers';

@Injectable()
export class StateService {
  public twiglet: TwigletService;
  public view: ViewService;

  constructor() {
    this.twiglet = {
      links: new LinksService(),
      nodes: new NodesService(),
    };
    this.view = new ViewService();
  }
}

export interface TwigletService {
  nodes: NodesService;
  links: LinksService;
}

export class StateServiceStub {
  public twiglet: TwigletService;
  public view: ViewService;

  constructor() {
    this.twiglet = {
      links: new LinksServiceStub(),
      nodes: new NodesServiceStub(),
    };
    this.view = new ViewService();
  }
}

