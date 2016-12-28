import { ChangeDetectionStrategy, Input, Component } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import { StateService } from '../state.service';

import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navigation-view',
  styleUrls: ['./navigation-view.component.css'],
  templateUrl: './navigation-view.component.html',
})
export class NavigationViewComponent { }

