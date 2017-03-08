import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from './../state.service';

@Component({
  selector: 'app-left-side-bar',
  styleUrls: ['./left-side-bar.component.scss'],
  templateUrl: './left-side-bar.component.html',
})
export class LeftSideBarComponent {
  userState: Map<string, any> = Map({});

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  };

}
