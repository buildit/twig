import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from '../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-right-side-bar',
  styleUrls: ['./right-side-bar.component.scss'],
  templateUrl: './right-side-bar.component.html',
})
export class RightSideBarComponent {
  twiglet: Map<string, any> = Map({});
  twigletModel: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });
    stateService.twiglet.modelService.observable.subscribe(response => {
      this.twigletModel = response;
      this.cd.markForCheck();
    });
    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  };
}
