import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-gravity',
  styleUrls: ['./twiglet-gravity.component.scss'],
  templateUrl: './twiglet-gravity.component.html',
})
export class TwigletGravityComponent implements OnInit {
  @Input() userState: Map<string, any>;
  @Input() viewData;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor() { }

  ngOnInit() {
  }

  disabledControl() {
    if (this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      if (this.userState.get(this.USERSTATE.IS_EDITING_VIEW)) {
        return false;
      }
      return true;
    }
    return false;
  }

}
