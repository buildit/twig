import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Observable ,  Subscription } from 'rxjs';

import { Model } from './../../non-angular/interfaces/model/index';
import { StateService } from '../state.service';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { UserState } from '../../non-angular/interfaces';
import USERSTATE_CONSTANTS from '../../non-angular/services-helpers/userState/constants';
import TWIGLET_CONSTANTS from '../../non-angular/services-helpers/twiglet/constants';
import MODEL_CONSTANTS from '../../non-angular/services-helpers/models/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userState: OrderedMap<string, any> = OrderedMap({});
  twigletName: string;
  modelName: string;
  USERSTATE = USERSTATE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;
  MODEL = MODEL_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public modalService: NgbModal) {

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });

    stateService.twiglet.observable.subscribe(twiglet => {
      this.twigletName = twiglet.get(this.TWIGLET.NAME);
      this.cd.markForCheck();
    });

    stateService.model.observable.subscribe(model => {
      this.modelName = model.get(this.MODEL.NAME);
      this.cd.markForCheck();
    });
  }

  isActive(name: string) {
    return this.userState.get(this.USERSTATE.MODE) === name ? 'active' : '';
  }

  getTwigletUrl() {
    return this.twigletName ? `/twiglet/${this.twigletName}` : '/'
  }

  getModelUrl() {
    return this.modelName ? `/model/${this.modelName}` : '/model'
  }
}
