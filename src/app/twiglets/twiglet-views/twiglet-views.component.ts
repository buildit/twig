import { Component, Input } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { StateService } from './../../state.service';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  selector: 'app-twiglet-views',
  styleUrls: ['./twiglet-views.component.scss'],
  templateUrl: './twiglet-views.component.html',
})
export class TwigletViewsComponent {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;

  constructor(public stateService: StateService) {  }
 }

