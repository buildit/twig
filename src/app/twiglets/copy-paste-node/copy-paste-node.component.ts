import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { fromJS, Map } from 'immutable';
import { clone } from 'ramda';
import { Subscription } from 'rxjs/Subscription';

import { D3Node, UserState } from '../../../non-angular/interfaces';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-copy-paste-node',
  styleUrls: ['./copy-paste-node.component.scss'],
  templateUrl: './copy-paste-node.component.html',
})
export class CopyPasteNodeComponent {
  @Input() userState: Map<string, any>;
  @Input() nodes: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  @Input() twigletModel: Map<string, any>;

  constructor(private stateService: StateService, public modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

  copyNode() {
    this.stateService.userState.setCopiedNodeId();
  }

  pasteNode() {
    if (this.userState.get('copiedNodeId')) {
      const copiedNode = clone(this.nodes.get(this.userState.get('copiedNodeId')).toJS());
      copiedNode.id = UUID.UUID();
      copiedNode.x = copiedNode.x + 25;
      this.stateService.twiglet.addNode(copiedNode);
      this.stateService.userState.setCurrentNode(copiedNode.id);
      const modelRef = this.modalService.open(EditNodeModalComponent);
      const component = <EditNodeModalComponent>modelRef.componentInstance;
      component.userState = this.userState;
      component.id = copiedNode.id;
      component.twiglet = this.twiglet;
      component.twigletModel = this.twigletModel;
      component.node = fromJS(copiedNode);
    }
  }

  /**
   *
   * Gets fired on any keydown event, in a timeout to spin off it's own "thread".
   * @param {any} $event
   *
   * @memberOf CopyPasteNodeComponent
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown($event) {
    setTimeout(() => {
      if ($event.metaKey && $event.code === 'KeyC' && this.userState.get('isEditing')) {
        this.copyNode();
      } else if ($event.metaKey && $event.code === 'KeyV' && this.userState.get('isEditing')) {
        const modalOpen = document.getElementsByClassName('modal-open');
        if (!modalOpen.length) {
          this.pasteNode();
        }
      }
    }, 0);
  }

}
