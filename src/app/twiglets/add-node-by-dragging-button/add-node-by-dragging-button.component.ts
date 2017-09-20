import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Map } from 'immutable';

import { ModelEntity } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';
import ENTITY_CONSTANTS from '../../../non-angular/services-helpers/models/constants/entity';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-node-by-dragging-button',
  styleUrls: ['./add-node-by-dragging-button.component.scss'],
  templateUrl: './add-node-by-dragging-button.component.html',
})
export class AddNodeByDraggingButtonComponent {
  @Input() entity;
  @Input() userState: Map<string, any>;
  ENTITY = ENTITY_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {  }

  /**
   * The action taken by the button on mousedown.
   *
   *
   * @memberOf AddNodeByDraggingButtonComponent
   */
  action() {
    this.stateService.userState.setNodeTypeToBeAdded(this.entity.get(this.ENTITY.TYPE));
  }
}
