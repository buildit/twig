import { Map } from 'immutable';
import { Component, ChangeDetectorRef, OnInit, AfterViewChecked } from '@angular/core';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';

@Component({
  selector: 'app-header-environment',
  styleUrls: ['./header-environment.component.scss'],
  templateUrl: './header-environment.component.html',
})
export class HeaderEnvironmentComponent {

  userState: Map<string, any> = Map({ currentViewName: null });

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.stateService.userState.observable.subscribe(response => {
      this.userState = response;
      this.cd.markForCheck();
    });
   }
}
