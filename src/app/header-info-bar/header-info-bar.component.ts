import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent implements AfterViewChecked {

  userState: UserState = { currentViewName: null } ;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {  }

  ngAfterViewChecked() {
    this.stateService.userState.observable.subscribe(response => {
      this.userState = response.toJS();
      // Getting a dev-mode only error, not sure why I need the detectChanges here.
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
  }
}
