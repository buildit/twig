import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Map } from 'immutable';

import { StateService } from '../state.service';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { NodeSortPipe } from './../node-sort.pipe';

@Component({
  selector: 'app-model-view',
  styleUrls: ['./model-view.component.scss'],
  templateUrl: './model-view.component.html',
})
export class ModelViewComponent implements OnInit, OnDestroy {
  routeSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
  private route: ActivatedRoute, public fb: FormBuilder) {
    this.form = this.fb.group({
      entities: this.fb.array([])
    });
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.stateService.model.loadModel(params['id']);
    });

     this.stateService.model.observable.subscribe(response => {
      this.model = response;
      this.buildForm();
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      entities: this.fb.array(this.model.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
  }

  createEntity(entity = Map({})) {
    return this.fb.group({
      class: entity.get('class') || '',
      color: entity.get('color') || '',
      image: entity.get('image') || '',
      size: entity.get('size') || '',
      type: entity.get('type') || ''
    });
  }

  removeEntity(index: number) {
    let entities = <FormArray>this.form.get('entities');
    entities.removeAt(index);
  }

  addEntity() {
    let entities = <FormArray>this.form.get('entities');
    entities.push(this.createEntity());
  }

}
