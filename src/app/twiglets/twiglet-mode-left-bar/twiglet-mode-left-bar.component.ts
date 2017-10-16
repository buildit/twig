import { StateService } from './../../state.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data'
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-mode-left-bar',
  styleUrls: ['./twiglet-mode-left-bar.component.scss'],
  templateUrl: './twiglet-mode-left-bar.component.html',
})
export class TwigletModeLeftBarComponent {
  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  @Input() eventsList: OrderedMap<string, Map<string, any>>;
  @Input() sequences;
  @Input() views;
  @Input() viewData;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;

  constructor(private stateService: StateService) { }

  handleChange($event: NgbPanelChangeEvent) {
    this.stateService.userState.setCurrentTwigConfig($event.panelId)
  }
}
