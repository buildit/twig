import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { StateService } from '../state.service';
import { ViewService } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-controls',
  styleUrls: ['./edit-twiglet-controls.component.css'],
  templateUrl: './edit-twiglet-controls.component.html',
})
export class EditTwigletControlsComponent {

  viewState: ViewService;

  constructor(state: StateService) {
    this.viewState = state.view;
  }
}
