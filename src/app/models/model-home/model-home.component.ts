import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { List, Map } from 'immutable';
import { Subscription } from 'rxjs';

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
    this.stateService.model.clearModel();
    this.stateService.userState.setMode('model');
  }

  ngOnDestroy() {
    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }
    if (this.modelsSubscription) {
      this.modelsSubscription.unsubscribe();
    }
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }

}
