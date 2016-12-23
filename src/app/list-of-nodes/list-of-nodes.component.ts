    import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
    import { clone } from 'ramda';
    import { UUID } from 'angular2-uuid';

    import { StateService } from '../state.service';

    import { D3Node } from '../../non-angular/interfaces';
    import { NodesService, UserStateService } from '../../non-angular/services-helpers';

    @Component({
      changeDetection: ChangeDetectionStrategy.OnPush, // tslint:disable-line
      selector: 'app-list-of-nodes',
      styleUrls: ['./list-of-nodes.component.css'],
      templateUrl: './list-of-nodes.component.html',
    })
    export class ListOfNodesComponent implements OnInit {
      formNode: D3Node;
      /**
       * The injected service from ./state.service
       */
      nodesService: NodesService;
      userStateService: UserStateService;

      constructor(state: StateService) {
        this.nodesService = state.twiglet.nodes;
        this.userStateService = state.userState;
      }

      ngOnInit () {
        this.formNode = {
          id: UUID.UUID(),
          name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
          type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
        };
      }

      /**
       * Adds a node to the twiglet via the service then generates a new node (for testing)
       *
       *
       * @memberOf ListOfNodesComponent
       */
      addNode () {
        this.nodesService.addNode(clone(this.formNode));
        this.formNode = {
          id: UUID.UUID(),
          name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
          type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
        };
      }

      /**
       * Removes a node from the twiglet.
       *
       * @param {D3Node} node
       *
       * @memberOf ListOfNodesComponent
       */
      removeNode (node: D3Node) {
        this.nodesService.removeNode(node);
      }

    }
