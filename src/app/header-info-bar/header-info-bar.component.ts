import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';
import { Twiglet } from './../../non-angular/interfaces/twiglet';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent implements AfterViewChecked {

  userState: UserState = { currentViewName: null } ;
  twiglet: Twiglet = { };

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {  }

  ngAfterViewChecked() {
    this.stateService.userState.observable.subscribe(response => {
      this.userState = response.toJS() as UserState;
      this.cd.detectChanges();
      this.cd.markForCheck();
    });

    this.stateService.twiglet.observable.subscribe(response => {
      this.twiglet = response.toJS() as Twiglet;
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
  }
}
