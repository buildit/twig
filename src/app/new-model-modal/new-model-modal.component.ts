import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Validators } from '../../non-angular/utils/formValidators';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs';
import { Map, fromJS, List } from 'immutable';

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
  modelNames: string[] = [];
  form: FormGroup;
  formErrors = {
    entities: '',
    name: ''
  };
  blankEntityFormErrors = {
    class: '',
    type: ''
  };
  validationMessages = {
    class: {
      required: 'You must choose an icon for your entity!'
    },
    entities: {
      name: 'Please name all of your entities.',
      required: 'Please add at least one entity.'
    },
    name: {
      required: 'You must enter a name for your model!',
      unique: 'A model with this name already exists! Please rename this model.'
    },
    type: {
      required: 'You must name your entity!'
    }
  };

  constructor(public activeModal: NgbActiveModal, public stateService: StateService, private cd: ChangeDetectorRef,
  public fb: FormBuilder, public router: Router, public toastr: ToastsManager) { }

  setupModelLists(models: List<Object>) {
    this.modelNames = models.toJS().map(model => model.name);
  }

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
      name: ['', [Validators.required, this.validateName.bind(this)]]
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  // as values on the form change, validate them
  onValueChanged() {
    if (!this.form) { return; };
    const form = this.form;
    Reflect.ownKeys(this.formErrors).forEach((key: string) => {
      this.formErrors[key] = '';
      const control = form.get(key);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[key];
        if (control.errors) {
          Reflect.ownKeys(control.errors).forEach(error => {
            this.formErrors[key] += messages[error] + ' ';
          });
        }
      }
    });
    // use similar method to check the blank entity part of form, separated into its own function for clarity
    this.checkBlankEntity();
  }

  checkBlankEntity() {
    const blankEntityForm = <FormGroup>this.form.controls['blankEntity'];
    Reflect.ownKeys(this.blankEntityFormErrors).forEach((key: string) => {
      this.blankEntityFormErrors[key] = '';
      const control = blankEntityForm.get(key);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[key];
        if (control.errors) {
          Reflect.ownKeys(control.errors).forEach(error => {
            this.blankEntityFormErrors[key] += messages[error] + ' ';
          });
        }
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
      cloneModel: '',
      commitMessage: '',
      entities: {},
      name: ''
    };
    let emptyEntityName = false;
    this.form.value.name = this.form.value.name.trim();
    // ensure empty name doesn't get submitted
    if (this.form.value.name.length === 0) {
      this.formErrors['name'] += this.validationMessages['name'].required + ' ';
    } else if (this.form.value.entities.length === 0) {
      // ensure a model with no entities doesn't get submitted
        this.formErrors['entities'] += this.validationMessages['entities'].required + ' ';
      } else {
        for (let i = 0; i < this.form.value.entities.length; i ++) {
          this.form.value.entities[i].type = this.form.value.entities[i].type.trim();
          // ensure all the entities being submitted have names
          if (this.form.value.entities[i].type.length === 0) {
            emptyEntityName = true;
            this.formErrors['entities'] += this.validationMessages['entities'].name + ' ';
          } else {
            modelToSend.entities[this.form.value.entities[i].type] = this.form.value.entities[i];
          }
        }
        if (!emptyEntityName) {
          modelToSend.name = this.form.value.name;
          modelToSend.commitMessage = 'Model Created';
          this.stateService.model.addModel(modelToSend).subscribe(response => {
            this.stateService.model.updateListOfModels();
            this.activeModal.close();
            this.router.navigate(['model', response.name]);
            this.toastr.success('Model Created');
          }, this.handleError.bind(this));
        }
      }
  }

  handleError(error) {
    console.error(error);
    const message = error._body ? JSON.parse(error._body).message : error.statusText;
    this.toastr.error(message, 'Server Error');
  }

  validateName(c: FormControl) {
    return !this.modelNames.includes(c.value) ? null : {
      unique: {
        valid: false,
      }
    };
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
