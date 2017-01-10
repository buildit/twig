import { Component, OnInit } from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';
import { clone } from 'ramda';
import { UUID } from 'angular2-uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { D3Node, UserState } from '../../non-angular/interfaces';
import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';
import { TwigletGraphComponent } from '../twiglet-graph/twiglet-graph.component';

@Component({
  selector: 'app-copy-paste-node',
  styleUrls: ['./copy-paste-node.component.scss'],
  templateUrl: './copy-paste-node.component.html',
})
export class CopyPasteNodeComponent implements OnInit {
  node: D3Node;
  copiedNode;
  subscription: Subscription;
  userState: UserState = {
    copiedNodeId: '',
    currentNode: '',
  };

  constructor(private stateService: StateService, public modalService: NgbModal) { }

  ngOnInit() {
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      if (!this.userState.currentNode) {
        this.userState.currentNode = '';
      }
    });
  }

  copyNode() {
    this.stateService.userState.setCopiedNodeId();
  }

  pasteNode() {
    if (this.userState.copiedNodeId) {
      this.subscription = this.stateService.twiglet.nodes.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
        this.node = response.get(this.userState.copiedNodeId).toJS();
      });
      this.copiedNode = clone(this.node);
      this.copiedNode.id = UUID.UUID();
      this.copiedNode.x = this.copiedNode.x + 25;
      this.stateService.twiglet.nodes.addNode(this.copiedNode);
      const modelRef = this.modalService.open(EditNodeModalComponent);
      modelRef.componentInstance.id = this.copiedNode.id;
    }
  }

}
