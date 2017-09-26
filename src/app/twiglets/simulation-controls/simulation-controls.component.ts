import { Component, Input } from '@angular/core';

import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-simulation-controls',
  styleUrls: ['./simulation-controls.component.scss'],
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  @Input() viewData: Map<string, any>;
  @Input() userState: Map<string, any>;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor() { }

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
