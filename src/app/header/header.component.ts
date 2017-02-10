import { router } from './../app.router';
import { Router } from '@angular/router';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Map, List } from 'immutable';
import { StateService } from './../state.service';
import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { UserState } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  activeTwiglet = false;
  activeModel = false;
  twiglet: Map<string, any> = Map({});
  twiglets: List<Object>;
  twigletModel: Map<string, any> = Map({});
  models: List<Object>;
  model: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});
  activeId = 'twigletTab';

  constructor(stateService: StateService, router: Router, private cd: ChangeDetectorRef) {
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });
    stateService.twiglet.twiglets.subscribe(twiglets => {
      this.twiglets = twiglets;
      this.cd.markForCheck();
    });
    stateService.twiglet.modelService.observable.subscribe(model => {
      this.twigletModel = model;
      this.cd.markForCheck();
    });
    stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });
    stateService.model.observable.subscribe(model => {
      this.model = model;
      this.cd.markForCheck();
    });
    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }
}
