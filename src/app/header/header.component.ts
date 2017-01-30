import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { StateService } from './../state.service';
import { Component, Input } from '@angular/core';

import { UserState } from '../../non-angular/interfaces';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  twiglet: Twiglet;

  constructor(stateService: StateService) {
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet.toJS();
    });
  }
}
