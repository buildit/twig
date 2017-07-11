import { Component, ChangeDetectorRef, OnInit, AfterViewChecked, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  selector: 'app-environment-controls',
  styleUrls: ['./environment-controls.component.scss'],
  templateUrl: './environment-controls.component.html',
})
export class EnvironmentControlsComponent {
  @Input() userState: Map<string, any>;
  @Input() twigletModel: Map<string, any>;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef) {
  }
}
