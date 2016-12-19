import { Component, OnInit } from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { clone } from 'ramda';
import { UUID } from 'angular2-uuid';

import { StateService } from '../state.service';

import { D3Node } from '../interfaces';
import { NodesService } from '../services-helpers';

@Component({
  selector: 'app-list-of-nodes',
  styleUrls: ['./list-of-nodes.component.css'],
  templateUrl: './list-of-nodes.component.html',
})
export class ListOfNodesComponent implements OnInit {

  nodes: OrderedMap<string, Map<string, any>>;
  formNode: D3Node;
  /**
   * The injected service from ./state.service
   */
  private nodesService: NodesService;

  constructor(state: StateService) {
    this.nodesService = state.twiglet.nodes;
  }

  ngOnInit () {
    this.formNode = {
      id: UUID.UUID(),
      name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
      type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
    };
  }

  addNode () {
    this.nodesService.addNode(clone(this.formNode));
    this.formNode = {
      id: UUID.UUID(),
      name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
      type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
    };
  }

  removeNode (node: D3Node) {
    this.nodesService.removeNode(node);
  }

}
