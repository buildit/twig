import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link, D3Node, Twiglet } from './interfaces/twiglet';
import { LinksService, NodesService } from './services-helpers';

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


