import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { List, Map } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { StateService } from './../../state.service';

@Component({
  selector: 'app-model-view',
  styleUrls: ['./model-view.component.scss'],
  templateUrl: './model-view.component.html',
})
export class ModelViewComponent implements OnDestroy, OnInit {
  models: List<Object>;
  model: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});
  // modelSubscription: Subscription;
  modelsSubscription: Subscription;
  userStateSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.modelsSubscription = stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });

    // this.modelSubscription = stateService.model.observable.subscribe(model => {
    //   this.model = model;
    //   // this.cd.detectChanges();
    //   // this.cd.markForCheck();
    // });

    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.modelsSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }

}
