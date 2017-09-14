import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-environment-controls',
  styleUrls: ['./environment-controls.component.scss'],
  templateUrl: './environment-controls.component.html',
})
export class EnvironmentControlsComponent {
  @Input() userState: Map<string, any>;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef) {
  }
}
