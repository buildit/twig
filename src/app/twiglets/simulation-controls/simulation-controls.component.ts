import { Component, Input } from '@angular/core';

import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';

@Component({
  selector: 'app-simulation-controls',
  styleUrls: ['./simulation-controls.component.scss'],
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  @Input() viewData: Map<string, any>;
  VIEW_DATA = VIEW_DATA_CONSTANTS;

  constructor() { }

}
