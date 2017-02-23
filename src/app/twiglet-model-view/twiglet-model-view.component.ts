import { Router, ActivatedRoute, Params } from '@angular/router';
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
  twiglet: Map<string, any>;
  nodes: any[];
  modelSubscription: Subscription;
  modelEventsSubscription: Subscription;
  twigletSubscription: Subscription;
  form: FormGroup;
  formErrors = {
    class: '',
    type: ''
  };
  entityFormErrors = {
    class: '',
    type: ''
  };
  validationMessages = {
    class: {
      required: 'You must choose an icon for your entity!'
    },
    type: {
      required: 'You must name your entity!'
    }
  };

  constructor(public stateService: StateService,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder,
    private route: ActivatedRoute) {
    let formBuilt = false;
    this.modelSubscription = stateService.twiglet.modelService.observable.subscribe(model => {
      const newModel = this.twigletModel.get('entities') && this.twigletModel.get('entities').size === 0
        && model.get('entities').size !== 0;
      this.twigletModel = model;
      if (newModel) {
        this.buildForm();
      }
      this.cd.markForCheck();
    });
    this.route.params.subscribe((params: Params) => {
      this.stateService.twiglet.loadTwiglet(params['id']);
    });
    this.twigletSubscription = stateService.twiglet.observable.subscribe(twiglet => {
      twiglet.get('nodes').reduce((array, nodes) => {
        array.push(nodes.toJS());
        this.nodes = array;
        return this.nodes;
      }, []);
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
    this.modelEventsSubscription = this.stateService.twiglet.modelService.events.subscribe(response => {
      if (response === 'restore') {
        this.buildForm();
      }
    });
  }

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
    this.modelEventsSubscription.unsubscribe();
    this.twigletSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
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
      entities: this.fb.array(this.twigletModel.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
    this.form.valueChanges.subscribe(changes => {
      this.stateService.twiglet.modelService.updateEntities(changes.entities);
    });
  }

  onValueChanged() {
    if (!this.form) { return; }
    this.stateService.userState.setFormValid(true);
    const form = <FormGroup>this.form.controls['blankEntity'];
    Reflect.ownKeys(this.formErrors).forEach((key: string) => {
      this.formErrors[key] = '';
      const control = form.get(key);
      if (control && control.dirty && !control.valid) {
        this.stateService.userState.setFormValid(false);
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.formErrors[key] += messages[error] + ' ';
        });
      }
    });
    const entityForm = <FormGroup>this.form.controls['entities'];
    const entityFormArray = entityForm.controls;
    Reflect.ownKeys(entityFormArray).forEach((key: string) => {
      Reflect.ownKeys(this.entityFormErrors).forEach((errorKey: string) => {
        if (key !== 'length') {
          const control = entityFormArray[key].get(errorKey);
          if (control && control.dirty && !control.valid) {
            this.stateService.userState.setFormValid(false);
            const messages = this.validationMessages[errorKey];
            Reflect.ownKeys(control.errors).forEach(error => {
              this.entityFormErrors[errorKey] += messages[error] + ' ';
            });
          }
        }
      });
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
      entities.push(this.createEntity(fromJS(newEntity.value)));
      newEntity.reset({ color: '#000000' });
    } else {
      if (newEntity.value.type.length === 0) {
        this.formErrors.type = 'You must name your entity!';
      }
      if (newEntity.controls['class'].invalid) {
        this.formErrors.class = 'You must choose an icon for your entity!';
      }
    }
  }

  inTwiglet(type) {
    for (let i = 0; i < this.nodes.length; i ++) {
      if (this.nodes[i].type === type) {
        return true;
      }
    }
  }

}

