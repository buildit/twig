import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs';
import { Map, fromJS } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';

@Component({
  selector: 'app-new-model-modal',
  styleUrls: ['./new-model-modal.component.scss'],
  templateUrl: './new-model-modal.component.html',
})
export class NewModelModalComponent implements OnInit, AfterViewChecked {
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;
  formErrors = {
    entities: '',
    name: ''
  };
  blankEntityFormErrors = {
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
    entities: 'Please add at least one entity.',
    name: {
      required: 'You must enter a name for your model!'
    },
    type: {
      required: 'You must name your entity!'
    }
  };

  constructor(public activeModal: NgbActiveModal, public stateService: StateService, private cd: ChangeDetectorRef,
  public fb: FormBuilder, public router: Router, public toastr: ToastsManager) { }

  ngOnInit() {
    this.buildForm();
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
      entities: this.fb.array([]),
      name: ['', Validators.required]
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  onValueChanged() {
    if (!this.form) { return; };
    this.stateService.userState.setFormValid(true);
    const form = this.form;
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
    this.checkBlankEntity();
  }

  checkBlankEntity() {
    const blankEntityForm = <FormGroup>this.form.controls['blankEntity'];
    Reflect.ownKeys(this.blankEntityFormErrors).forEach((key: string) => {
      this.blankEntityFormErrors[key] = '';
      const control = blankEntityForm.get(key);
      if (control && control.dirty && !control.valid) {
        this.stateService.userState.setFormValid(false);
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.blankEntityFormErrors[key] += messages[error] + ' ';
        });
      }
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
    } else {
      if (newEntity.value.type.length === 0) {
        this.blankEntityFormErrors.type = 'You must name your entity!';
      }
      if (newEntity.controls['class'].invalid) {
        this.blankEntityFormErrors.class = 'You must choose an icon for your entity!';
      }
    }
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

  processForm() {
    this.formErrors['name'] = '';
    this.formErrors['entities'] = '';
    const modelToSend = {
      commitMessage: '',
      entities: {},
      name: ''
    };
    this.form.value.name = this.form.value.name.trim();
    if (this.form.value.name.length === 0) {
      this.formErrors['name'] += this.validationMessages['name'].required + ' ';
    } else if (this.form.value.entities.length === 0) {
        this.formErrors['entities'] += this.validationMessages['entities'] + ' ';
      } else {
        modelToSend.name = this.form.value.name;
        for (let i = 0; i < this.form.value.entities.length; i ++) {
          modelToSend.entities[this.form.value.entities[i].type] = this.form.value.entities[i];
        }
        modelToSend.commitMessage = 'Model Created';
        this.stateService.model.addModel(modelToSend).subscribe(response => {
          this.stateService.model.updateListOfModels();
          this.activeModal.close();
          this.router.navigate(['model', response.name]);
          this.toastr.success('Model Created');
        }, this.handleError.bind(this));
      }
  }

  handleError(error) {
    console.error(error);
    const message = error._body ? JSON.parse(error._body).message : error.statusText;
    this.toastr.error(message, 'Server Error');
  }

}

function findIndexToInsertNewEntity(entities: FormArray, newEntity: FormGroup): number {
  if (entities.length) {
    if (newEntity.value.type.toLowerCase() < entities.controls[0].value.type.toLowerCase()) {
      return 0;
    }
    for (let i = 1; i < entities.length; i++) {
      if (newEntity.value.type.toLowerCase() < entities.controls[i].value.type.toLowerCase()) {
        return i;
      }
    }
    return entities.length;
  } else {
    return 0;
  }

}
