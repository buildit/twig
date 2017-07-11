import { StateService } from './../../state.service';
import { GravityPoint } from './../../../non-angular/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Map } from 'immutable';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gravity-list',
  styleUrls: ['./gravity-list.component.scss'],
  templateUrl: './gravity-list.component.html',
})
export class GravityListComponent implements OnInit {
  @Input() userState: Map<string, any>;

  constructor(private stateService: StateService) { }

  ngOnInit() {  }

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
