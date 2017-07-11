import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Model } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent {
  userState: OrderedMap<string, any> = OrderedMap({});

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public router: Router,
    public modalService: NgbModal) {

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }
}

