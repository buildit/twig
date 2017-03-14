import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from './../state.service';

@Component({
  selector: 'app-left-side-bar',
  styleUrls: ['./left-side-bar.component.scss'],
  templateUrl: './left-side-bar.component.html',
})
export class LeftSideBarComponent {
  twiglet: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });
  };

}
