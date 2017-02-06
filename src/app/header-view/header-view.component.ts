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
  @Input() userState: Map<string, any>;
  @Input() twigletModel: Map<string, any>;
  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {  }
 }

