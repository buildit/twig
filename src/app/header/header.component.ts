import { router } from './../app.router';
import { Router } from '@angular/router';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Map } from 'immutable';
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
  activeTwiglet = false;
  activeModel = false;
  userState: Map<string, any> = Map({});
  activeId = 'twigletTab';

  constructor(stateService: StateService, router: Router) {
    stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
    router.events.subscribe(event => {
      if (event.url.startsWith('/twiglet')) {
        this.activeId = 'twigletTab';
        this.activeTwiglet = true;
        this.activeModel = false;
      } else if (event.url.startsWith('/model')) {
        this.activeId = 'modelTab';
        this.activeModel = true;
        this.activeTwiglet = false;
      }
    });
  }
}
