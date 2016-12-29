import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent {

  userState: UserState;

  constructor(stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.userState.observable.subscribe(response => {
      this.userState = response.toJS();
      this.cd.markForCheck();
    });
  }
}
