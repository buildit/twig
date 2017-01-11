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
  node: D3Node;
  disabled: boolean;
  subscription: Subscription;
  userState: UserState = {
    copiedNodeId: '',
    currentNode: '',
  };

  constructor(private stateService: StateService, public modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stateService.userState.observable.subscribe(response => {
      this.disabled = !response.get('isEditing');
      this.cd.markForCheck();
      userStateServiceResponseToObject.bind(this)(response);
      if (!this.userState.currentNode) {
        this.userState.currentNode = '';
      }
    });
  }

  copyNode() {
    this.stateService.userState.setCopiedNodeId();
    this.subscription = this.stateService.twiglet.nodes.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.node = response.get(this.userState.copiedNodeId).toJS();
    });
  }

  pasteNode() {
    if (this.userState.copiedNodeId) {
      const copiedNode = clone(this.node);
      copiedNode.id = UUID.UUID();
      copiedNode.x = copiedNode.x + 25;
      this.stateService.twiglet.nodes.addNode(copiedNode);
      const modelRef = this.modalService.open(EditNodeModalComponent);
      modelRef.componentInstance.id = copiedNode.id;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown($event) {
    if (($event.metaKey || $event.ctrlKey) && $event.code === 'KeyC' && !this.disabled) {
      this.copyNode();
    }

    if (($event.metaKey || $event.ctrlKey) && $event.code === 'KeyV' && !this.disabled) {
      this.pasteNode();
    }
  }

}
