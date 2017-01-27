import { StateService } from './../state.service';
import { Component, Input } from '@angular/core';

import { UserState } from '../../non-angular/interfaces';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userState: UserState = {};

  constructor(stateService: StateService) {
    stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }
}
