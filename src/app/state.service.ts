import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node, Twiglet } from './interfaces/twiglet';
import { LinksService, LinksServiceStub, NodesService, NodesServiceStub } from './services-helpers';

@Injectable()
export class StateService {
  public twiglet: TwigletService;

  constructor() {
    this.twiglet = {
      links: new LinksService(),
      nodes: new NodesService(),
    };
  }
}

export interface TwigletService {
  nodes: NodesService;
  links: LinksService;
}

export class StateServiceStub {
  public twiglet: TwigletService;

  constructor() {
    this.twiglet = {
      links: new LinksServiceStub(),
      nodes: new NodesServiceStub(),
    };
  }
}

