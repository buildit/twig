import { Component, ChangeDetectorRef, OnInit, AfterViewChecked, Input } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  selector: 'app-header-environment',
  styleUrls: ['./header-environment.component.scss'],
  templateUrl: './header-environment.component.html',
})
export class HeaderEnvironmentComponent {
  @Input() userState: Map<string, any>;
  @Input() twigletModel: Map<string, any>;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef) {
   }
}
