import { Component, Input } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { StateService } from './../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-twiglet-views',
  styleUrls: ['./twiglet-views.component.scss'],
  templateUrl: './twiglet-views.component.html',
})
export class TwigletViewsComponent {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService) {  }

}
