import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Rx';

import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnDestroy {
  userState: Map<string, any> = Map({});
  userStateSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
  }

}
