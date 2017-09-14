import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Model } from './../../non-angular/interfaces/model/index';
import { StateService } from '../state.service';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { UserState } from '../../non-angular/interfaces';
import USERSTATE_CONSTANTS from '../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userState: OrderedMap<string, any> = OrderedMap({});
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public router: Router,
    public modalService: NgbModal) {

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  isActive(name: string) {
    return this.userState.get(this.USERSTATE.MODE) === name ? 'active' : '';
  }
}
