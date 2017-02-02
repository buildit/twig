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
  model: Map<string, any> = Map({});
  form: FormGroup;
  errorMessageType: string;
  errorMessageClass: string;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
  private route: ActivatedRoute, public fb: FormBuilder) {
    this.form = this.fb.group({
      entities: this.fb.array([])
    });
  }

  ngOnInit() {
    let formBuilt = false;
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      formBuilt = false;
      this.stateService.model.loadModel(params['id']);
    });
    this.stateService.model.observable.subscribe(response => {
      this.model = response;
      if (!formBuilt) {
        this.buildForm();
        if (response.get('_id')) {
          formBuilt = true;
        }
      } else {
        const reduction = response.get('entities').reduce((array, model) => {
          array.push(model.toJS());
          return array;
        }, []);
        (this.form.controls['entities'] as FormArray)
          .patchValue(reduction.sort(sortByTypeSpacesLast), { emitEvent: false });
      }
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
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
    const blankEntity = <FormArray>this.form.controls['blankEntity'];
    if (this.form.valid) {
      let entities = <FormArray>this.form.get('entities');
      entities.push(this.createEntity(fromJS(blankEntity.value)));
      blankEntity.reset();
      this.errorMessageType = '';
      this.errorMessageClass = '';
    } else {
      if (blankEntity.controls['type'].invalid) {
        this.errorMessageType = 'You must name your entity!';
      }
      if (blankEntity.controls['class'].invalid) {
        this.errorMessageClass = 'You must choose a class for your entity!';
      }
    }
  }

}

function sortByTypeSpacesLast(first: ModelEntity, second: ModelEntity) {
  const firstString = first.type.toLowerCase();
  const secondString = second.type.toLowerCase();
  if (firstString && firstString < secondString) {
    return -1;
  } else if (secondString && firstString > secondString) {
    return 1;
  }
  return 0;
}
