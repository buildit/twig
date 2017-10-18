import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './../../shared/pipes/object-to-array.pipe';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-clone-model-modal',
  styleUrls: ['./clone-model-modal.component.scss'],
  templateUrl: './clone-model-modal.component.html',
})
export class CloneModelModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  modelName: string;
  modelNames: string[] = [];
  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'You must enter a name for your model!',
      slash: '/, ? characters are not allowed.',
      unique: 'A model with this name already exists! Please rename this model.',
    }
  };

  constructor(public activeModal: NgbActiveModal, public stateService: StateService, private cd: ChangeDetectorRef,
  public fb: FormBuilder, public router: Router, public toastr: ToastsManager) { }

  setupModelLists(models: List<Object>) {
    this.modelNames = models.toJS().map(model => model.name);
  }

  ngOnInit() {
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [`${this.modelName} - clone`, [Validators.required, this.validateName.bind(this), this.validateSlash.bind(this)]]
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
  }

  processForm() {
    const modelToSend = {
      cloneModel: this.modelName,
      commitMessage: '',
      entities: {},
      name: ''
    };

    this.form.value.name = this.form.value.name.trim();
    // ensure empty name doesn't get submitted
    if (this.form.value.name.length === 0) {
      this.formErrors['name'] += this.validationMessages['name'].required + ' ';
    } else {
      modelToSend.name = this.form.value.name;
      modelToSend.commitMessage = `${this.form.value.name} created`;
      this.stateService.model.addModel(modelToSend).subscribe(response => {
        this.stateService.model.updateListOfModels();
        this.activeModal.close();
        this.router.navigate(['model', response.name]);
        this.toastr.success(`${this.form.value.name} created`, null);
      }, this.handleError.bind(this));
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

  validateSlash(c: FormControl) {
    if ((c.value && c.value.includes('/')) || (c.value && c.value.includes('?'))) {
      return {
        slash: {
          valid: false
        }
      };
    }
  }

}
