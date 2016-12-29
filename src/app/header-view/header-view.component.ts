import { ChangeDetectionStrategy, Input, Component } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-view',
  styleUrls: ['./header-view.component.css'],
  templateUrl: './header-view.component.html',
})
export class HeaderViewComponent { }

