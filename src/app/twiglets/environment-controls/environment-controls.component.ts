import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-environment-controls',
  styleUrls: ['./environment-controls.component.scss'],
  templateUrl: './environment-controls.component.html',
})
export class EnvironmentControlsComponent {
  @Input() viewData: Map<string, any>;
  @Input() userState: Map<string, any>;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef) {
  }

  disabledControl() {
    if (this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      if (this.userState.get(this.USERSTATE.IS_EDITING_VIEW)) {
        return false;
      }
      return true;
    }
    return false;
  }
}
