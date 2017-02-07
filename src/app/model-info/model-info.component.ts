import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Map } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from './../../non-angular/interfaces/model/index';

@Component({
  selector: 'app-model-info',
  styleUrls: ['./model-info.component.scss'],
  templateUrl: './model-info.component.html',
})
export class ModelInfoComponent implements OnInit, OnDestroy {
  routeSubscription: Subscription;
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  entities = [];

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
  private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.stateService.model.loadModel(params['id']);
    });
    this.modelSubscription = this.stateService.model.observable.subscribe(response => {
      this.entities.length = 0;
      this.model = response;
      const entitiesObject = this.model.get('entities').toJS();
      Reflect.ownKeys(entitiesObject).forEach((key: string) => {
        this.entities.push(entitiesObject[key]);
      });
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.modelSubscription.unsubscribe();
  }

}
