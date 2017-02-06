import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-node-by-dragging-button',
  styleUrls: ['./add-node-by-dragging-button.component.scss'],
  templateUrl: './add-node-by-dragging-button.component.html',
})
export class AddNodeByDraggingButtonComponent {
  @Input() entity;
  @Input() userState: Map<string, any>;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {  }

  action(nodeType: string) {
    if (this.userState.get('isEditing')) {
      this.stateService.userState.setNodeTypeToBeAdded(nodeType);
    }
  }
}
