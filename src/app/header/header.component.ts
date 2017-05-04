import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Map, List } from 'immutable';

import { router } from './../app.router';
import { StateService } from './../state.service';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
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
  twigletChangelog: List<Map<string, any>> = List([]);
  twiglet: Map<string, any> = Map({});
  twiglets: List<Object>;
  twigletModel: Map<string, any> = Map({});
  models: List<Object>;
  model: Map<string, any> = Map({});
  views: List<Object>;
  sequences: List<Map<string, any>>;
  modelChangelog: List<Map<string, any>> = List([]);
  userState: Map<string, any> = Map({});
  activeId = 'twigletTab';

  constructor(private stateService: StateService, router: Router, private cd: ChangeDetectorRef) {
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

    stateService.twiglet.changeLogService.observable.subscribe(changelog => {
      this.twigletChangelog = changelog;
      this.cd.markForCheck();
    });

    stateService.model.changeLogService.observable.subscribe(changelog => {
      this.modelChangelog = changelog;
      this.cd.markForCheck();
    });

    stateService.twiglet.viewService.observable.subscribe(views => {
      this.views = views;
      this.cd.markForCheck();
    });

    stateService.twiglet.eventsService.sequences.subscribe(sequences => {
      this.sequences = sequences;
      this.cd.markForCheck();
    });
  }

  setTab({ nextId }) {
    this.stateService.userState.setActiveTab(nextId.split('Tab')[0]);
  }
}
