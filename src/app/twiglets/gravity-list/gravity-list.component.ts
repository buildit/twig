import { EditGravityPointModalComponent } from './../edit-gravity-point-modal/edit-gravity-point-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Map } from 'immutable';

import { GravityPoint } from './../../../non-angular/interfaces';
import { StateService } from './../../state.service';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';
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
  VIEW = VIEW_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, private modalService: NgbModal) { }

  newGravityPoint() {
    const gravityPoint = {
      id: UUID.UUID(),
      name: '',
      x: 100,
      y: 100,
    };
    this.stateService.twiglet.viewService.setGravityPoint(gravityPoint);
    const modelRef = this.modalService.open(EditGravityPointModalComponent);
    const component = <EditGravityPointModalComponent>modelRef.componentInstance;
    component.gravityPoint = gravityPoint;
  }

  deleteGravityPoint(id) {
    const gravityPoints = this.viewData.get(this.VIEW_DATA.GRAVITY_POINTS).toJS();
    delete gravityPoints[id];
    this.stateService.twiglet.viewService.setGravityPoints(gravityPoints);
  }
}
