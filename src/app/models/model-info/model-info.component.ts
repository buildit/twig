import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';

@Component({
  selector: 'app-model-info',
  styleUrls: ['./model-info.component.scss'],
  templateUrl: './model-info.component.html',
})
export class ModelInfoComponent implements OnInit, OnDestroy {
  @Input() models;
  @Input() userState;
  routeSubscription: Subscription;
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  entities = [];
  expanded = { };
  MODEL = MODEL_CONSTANTS;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.stateService.model.loadModel(params['name']);
    });
    this.modelSubscription = this.stateService.model.observable.subscribe(response => {
      this.entities.length = 0;
      this.model = response;
      const entitiesObject = this.model.get(this.MODEL.ENTITIES).toJS();
      Reflect.ownKeys(entitiesObject).forEach((key: string) => {
        this.entities.push(entitiesObject[key]);
      });
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.modelSubscription.unsubscribe();
  }

  toggleAttributes(index) {
    if (this.expanded[index]) {
      this.expanded[index] = !this.expanded[index];
    } else {
      this.expanded[index] = true;
    }
  }

}
