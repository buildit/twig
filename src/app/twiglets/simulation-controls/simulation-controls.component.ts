import { Component, Input } from '@angular/core';

import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-simulation-controls',
  styleUrls: ['./simulation-controls.component.scss'],
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  @Input() userState;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor() { }

}
