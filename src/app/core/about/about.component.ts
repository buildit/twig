import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Rx';
import { Config } from '../../../non-angular/config'

import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnDestroy, OnInit {
  userState: Map<string, any> = Map({});
  userStateSubscription: Subscription;
  USERSTATE = USERSTATE_CONSTANTS;
  Config = Config;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.stateService.userState.setMode('about');
  }

  ngOnDestroy() {
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }

}
