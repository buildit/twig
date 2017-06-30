import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { List, Map } from 'immutable';

import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-home',
  styleUrls: ['./model-home.component.scss'],
  templateUrl: './model-home.component.html',
})
export class ModelHomeComponent implements OnInit {
  models: List<Object>;
  model: Map<string, any> = Map({});
  modelChangelog: List<Map<string, any>> = List([]);
  userState: Map<string, any> = Map({});

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });

    stateService.model.observable.subscribe(model => {
      this.model = model;
      this.cd.markForCheck();
    });

    stateService.model.changeLogService.observable.subscribe(changelog => {
      this.modelChangelog = changelog;
      this.cd.markForCheck();
    });

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
  }

}
