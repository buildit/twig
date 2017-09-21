import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Map } from 'immutable';

import { GravityPoint } from './../../../non-angular/interfaces';
import { StateService } from './../../state.service';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import GRAVITY_POINT_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/gravity-point';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gravity-list',
  styleUrls: ['./gravity-list.component.scss'],
  templateUrl: './gravity-list.component.html',
})
export class GravityListComponent {
  @Input() userState: Map<string, any>;
  @Input() viewData: Map<string, any>;
  GRAVITY_POINT = GRAVITY_POINT_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService) { }

  newGravityPoint() {
    this.stateService.twiglet.viewService.setGravityPoint({
      id: UUID.UUID(),
      name: '',
      x: 100,
      y: 100,
    });
  }

  deleteGravityPoint(id) {
    const gravityPoints = this.viewData.get(this.VIEW_DATA.GRAVITY_POINTS).toJS();
    delete gravityPoints[id];
    this.stateService.twiglet.viewService.setGravityPoints(gravityPoints);
  }
}
