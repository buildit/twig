import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Map } from 'immutable';

import { ModelEntity } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';

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


  /**
   * The action taken by the button on mousedown.
   *
   *
   * @memberOf AddNodeByDraggingButtonComponent
   */
  action() {
    this.stateService.userState.setNodeTypeToBeAdded(this.entity.get('type'));
  }
}
