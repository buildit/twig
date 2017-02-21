import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Map, fromJS } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';

@Component({
  selector: 'app-twiglet-model-view',
  styleUrls: ['./twiglet-model-view.component.scss'],
  templateUrl: './twiglet-model-view.component.html',
})
export class TwigletModelViewComponent implements OnInit, OnDestroy, AfterViewChecked {
  twigletModel: Map<string, any> = Map({});
  modelSubscription: Subscription;
  form: FormGroup;

  constructor(public stateService: StateService,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder) {
    this.modelSubscription = stateService.twiglet.modelService.observable.subscribe(model => {
      this.twigletModel = model;
      this.cd.markForCheck();
    });
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
    console.log(this.twigletModel.get('entities').toJS());
    let formBuilt = false;
    this.stateService.userState.setFormValid(true);
    if (!formBuilt) {
      this.buildForm();
      formBuilt = true;
    } else {
      const reduction = this.twigletModel.get('entities').reduce((array, model) => {
        array.push(model.toJS());
        return array;
      }, []);
      (this.form.controls['entities'] as FormArray)
        .patchValue(reduction, { emitEvent: false });
    }
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      blankEntity: this.fb.group({
        class: [''],
        color: '#000000',
        image: '',
        size: '',
        type: ['']
      }),
      entities: this.fb.array(this.twigletModel.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
  }

  onValueChanged() {
    if (!this.form) { return; }
    this.stateService.userState.setFormValid(true);
  }

  createEntity(entity = Map({})) {
    return this.fb.group({
      class: [entity.get('class')],
      color: entity.get('color'),
      image: entity.get('image'),
      size: entity.get('size'),
      type: [entity.get('type')]
    });
  }

}
