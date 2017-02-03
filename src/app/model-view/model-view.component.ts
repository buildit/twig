import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Map, fromJS } from 'immutable';

import { StateService } from '../state.service';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';

@Component({
  selector: 'app-model-view',
  styleUrls: ['./model-view.component.scss'],
  templateUrl: './model-view.component.html',
})
export class ModelViewComponent implements OnInit, OnDestroy {
  routeSubscription: Subscription;
  modelSubscription: Subscription;
  modelEventsSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;
  errorMessageType: string;
  errorMessageClass: string;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
  private route: ActivatedRoute, public fb: FormBuilder) {
    this.form = this.fb.group({
      blankEntity: this.fb.group({
        class: ['', Validators.required],
        color: '#000000',
        image: '',
        size: '',
        type: ['', Validators.required]
      }),
      entities: this.fb.array([])
    });
  }

  ngOnInit() {
    let formBuilt = false;
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      formBuilt = false;
      this.stateService.model.loadModel(params['id']);
    });
    this.modelSubscription = this.stateService.model.observable.subscribe(response => {
      this.model = response;
      if (!formBuilt && response.get('_id')) {
        this.buildForm();
        formBuilt = true;
      } else {
        const reduction = response.get('entities').reduce((array, model) => {
          array.push(model.toJS());
          return array;
        }, []);
        (this.form.controls['entities'] as FormArray)
          .patchValue(reduction, { emitEvent: false });
      }
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
    this.modelEventsSubscription = this.stateService.model.events.subscribe(response => {
      if (response === 'restore') {
        this.buildForm();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.modelSubscription.unsubscribe();
    this.modelEventsSubscription.unsubscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      blankEntity: this.fb.group({
        class: ['', Validators.required],
        color: '#000000',
        image: '',
        size: '',
        type: ['', Validators.required]
      }),
      entities: this.fb.array(this.model.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
    this.form.valueChanges.subscribe(changes => {
      this.stateService.model.updateEntities(changes.entities);
    });
  }

  createEntity(entity = Map({})) {
    return this.fb.group({
      class: [entity.get('class') || '', Validators.required],
      color: entity.get('color') || '#000000',
      image: entity.get('image') || '',
      size: entity.get('size') || '',
      type: [entity.get('type') || '', Validators.required]
    });
  }

  removeEntity(index: number) {
    let entities = <FormArray>this.form.get('entities');
    entities.removeAt(index);
  }

  addEntity() {
    const newEntity = <FormGroup>this.form.controls['blankEntity'];
    newEntity.value.type = newEntity.value.type.trim();
    if (newEntity.valid && newEntity.value.type.length > 0) {
      const entities = <FormArray>this.form.get('entities');
      const newEntityIndex = findIndexToInsertNewEntity(entities, newEntity);
      entities.insert(newEntityIndex, this.createEntity(fromJS(newEntity.value)));
      newEntity.reset({ color: '#000000' });
      this.errorMessageType = '';
      this.errorMessageClass = '';
    } else {
      if (newEntity.value.type.length === 0) {
        this.errorMessageType = 'You must name your entity!';
      }
      if (newEntity.controls['class'].invalid) {
        this.errorMessageClass = 'You must choose an icon for your entity!';
      }
    }
  }

}

function findIndexToInsertNewEntity(entities: FormArray, newEntity: FormGroup): number {
  if (newEntity.value.type.toLowerCase() < entities.controls[0].value.type.toLowerCase()) {
    return 0;
  }
  for (let i = 1; i < entities.length; i++) {
    if (newEntity.value.type.toLowerCase() < entities.controls[i].value.type.toLowerCase()) {
      return i;
    }
  }
  return entities.length;
}
