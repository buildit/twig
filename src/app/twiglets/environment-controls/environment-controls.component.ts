import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';

@Component({
  selector: 'app-environment-controls',
  styleUrls: ['./environment-controls.component.scss'],
  templateUrl: './environment-controls.component.html',
})
export class EnvironmentControlsComponent {
  @Input() viewData: Map<string, any>;
  VIEW_DATA = VIEW_DATA_CONSTANTS;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef) {
  }
}
