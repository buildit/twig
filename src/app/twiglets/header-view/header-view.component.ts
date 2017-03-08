import { Input, Component } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { UserState } from '../../../non-angular/interfaces';
import { StateService } from './../../state.service';

@Component({
  selector: 'app-header-view',
  styleUrls: ['./header-view.component.scss'],
  templateUrl: './header-view.component.html',
})
export class HeaderViewComponent {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;

  constructor(private stateService: StateService) {  }
 }

