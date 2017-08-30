import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { List, Map } from 'immutable';
import { Subscription } from 'rxjs/Rx';

import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-home',
  styleUrls: ['./model-home.component.scss'],
  templateUrl: './model-home.component.html',
})
export class ModelHomeComponent implements OnInit, OnDestroy {
  models: List<Object>;
  model: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});
  modelSubscription: Subscription;
  modelsSubscription: Subscription;
  userStateSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.modelSubscription = stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });

    this.modelsSubscription = stateService.model.observable.subscribe(model => {
      this.model = model;
      this.cd.markForCheck();
    });

    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.stateService.userState.setMode('model');
  }

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
    this.modelsSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }

}
