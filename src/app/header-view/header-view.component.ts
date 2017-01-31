import { StateService } from './../state.service';
import { ChangeDetectionStrategy, Input, Component, ChangeDetectorRef } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-view',
  styleUrls: ['./header-view.component.scss'],
  templateUrl: './header-view.component.html',
})
export class HeaderViewComponent {
  private userState: Map<string, any> = Map({});
  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.userState.observable.subscribe(response => {
      this.userState = response;
      this.cd.markForCheck();
    });
  }
 }

