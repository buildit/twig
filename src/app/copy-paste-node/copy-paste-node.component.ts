import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';
import { clone } from 'ramda';
import { UUID } from 'angular2-uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { D3Node, UserState } from '../../non-angular/interfaces';
import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';

@Component({
  selector: 'app-copy-paste-node',
  styleUrls: ['./copy-paste-node.component.scss'],
  templateUrl: './copy-paste-node.component.html',
})
export class CopyPasteNodeComponent implements OnInit {
  nodes: OrderedMap<string, any>;
  disabled: boolean;
  subscription: Subscription;
  userState: UserState;

  constructor(private stateService: StateService, public modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stateService.userState.observable.subscribe(response => {
      this.disabled = !response.get('isEditing');
      userStateServiceResponseToObject.bind(this)(response);
    });
    this.subscription = this.stateService.twiglet.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.nodes = response.get('nodes');
    });
  }

  copyNode() {
    this.stateService.userState.setCopiedNodeId();
  }

  pasteNode() {
    if (this.userState.copiedNodeId) {
      const copiedNode = clone(this.nodes.get(this.userState.copiedNodeId).toJS());
      copiedNode.id = UUID.UUID();
      copiedNode.x = copiedNode.x + 25;
      this.stateService.twiglet.addNode(copiedNode);
      const modelRef = this.modalService.open(EditNodeModalComponent);
      modelRef.componentInstance.id = copiedNode.id;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown($event) {
    if ($event.metaKey && $event.code === 'KeyC' && !this.disabled) {
      this.copyNode();
    }

    if ($event.metaKey && $event.code === 'KeyV' && !this.disabled) {
      const modalOpen = document.getElementsByClassName('modal-open');
      if (!modalOpen.length) {
        this.pasteNode();
      }
    }
  }

}
