import { Router } from '@angular/router';
import { Map } from 'immutable';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-right-side-bar',
  styleUrls: ['./right-side-bar.component.scss'],
  templateUrl: './right-side-bar.component.html',
})
export class RightSideBarComponent {
  twiglet: Map<string, any> = Map({});
  twigletModel: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});
  mode: string;

  constructor(private stateService: StateService, private router: Router, private cd: ChangeDetectorRef) {
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });
    stateService.twiglet.modelService.observable.subscribe(response => {
      this.twigletModel = response;
      this.cd.markForCheck();
    });
    stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
    router.events.subscribe(event => {
      if (event.url.startsWith('/twiglet')) {
        this.mode = 'twiglet';
      } else if (event.url.startsWith('/model')) {
        this.mode = 'model';
      } else {
        this.mode = 'home';
      }
      this.cd.markForCheck();
    });
  };
}
