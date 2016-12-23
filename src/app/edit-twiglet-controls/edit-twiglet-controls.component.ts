import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { StateService } from '../state.service';
import { UserStateService } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-controls',
  styleUrls: ['./edit-twiglet-controls.component.css'],
  templateUrl: './edit-twiglet-controls.component.html',
})
export class EditTwigletControlsComponent {

  /**
   * The user state service, so that our toggles can access it directly.
   *
   * @type {UserStateService}
   * @memberOf EditTwigletControlsComponent
   */
  userState: UserStateService;

  constructor(state: StateService) {
    this.userState = state.userState;
  }
}
