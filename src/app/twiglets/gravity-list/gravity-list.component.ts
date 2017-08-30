import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Map } from 'immutable';

import { GravityPoint } from './../../../non-angular/interfaces';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gravity-list',
  styleUrls: ['./gravity-list.component.scss'],
  templateUrl: './gravity-list.component.html',
})
export class GravityListComponent {
  @Input() userState: Map<string, any>;

  constructor(private stateService: StateService) { }

  newGravityPoint() {
    this.stateService.userState.setGravityPoint({
      id: UUID.UUID(),
      name: '',
      x: 100,
      y: 100,
    });
  }

  deleteGravityPoint(id) {
    const gravityPoints = this.userState.get('gravityPoints').toJS();
    delete gravityPoints[id];
    this.stateService.userState.setGravityPoints(gravityPoints);
  }

}