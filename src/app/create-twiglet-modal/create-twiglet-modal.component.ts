import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';

import { StateService } from '../state.service';

@Component({
  selector: 'app-twiglet-modal',
  styleUrls: ['./create-twiglet-modal.component.scss'],
  templateUrl: './create-twiglet-modal.component.html',
})
export class CreateTwigletModalComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  formErrors = {
    model: '',
    name: '',
  };
  validationMessages = {
    model: {
      match: 'The model name must be from an existing model',
      required: 'A model is required.',
    },
    name: {
      required: 'A name is required.',
      unique: 'A Twiglet with this name already exists! Please rename this Twiglet.'
    },
  };
  twiglets: any[];
  twigletNames: string[] = [];
  models: any[];
  modelIds: string[] = [];

  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private stateService: StateService,
              private router: Router,
              private toastr: ToastsManager) { }

  ngOnInit() {
    this.buildForm();
    this.stateService.backendService.observable.subscribe(response => {
      this.twiglets = response.get('twiglets').toJS();
      this.twigletNames = this.twiglets.map(twiglet => twiglet.name);
    });
    this.stateService.backendService.observable.subscribe(response => {
      this.models = response.get('models').toJS();
      this.modelIds = this.models.map(model => model._id);
      this.form.patchValue({
        model: this.models[0]._id,
      });
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      cloneTwiglet: 'N/A',
      description: '',
      googlesheet: '',
      model: ['', [Validators.required, this.validateModelName.bind(this)]],
      name: ['', [Validators.required, this.validateName.bind(this)]],
    });
  }

  handleError(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  processForm() {
    if (this.form.valid) {
      this.form.value.commitMessage = 'Twiglet created.';
      this.form.value._id = 'twig-' + UUID.UUID();
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.stateService.backendService.updateListOfTwiglets();
        this.activeModal.close();
        this.router.navigate(['twiglet', data._id]);
      }, this.handleError.bind(this));
    }
  }

  onValueChanged() {
    if (!this.form) { return; }
    const form = this.form;

    Reflect.ownKeys(this.formErrors).forEach((key: string) => {
      this.formErrors[key] = '';
      const control = form.get(key);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.formErrors[key] += messages[error] + ' ';
        });
      }
    });
  }

  validateName(c: FormControl) {
    return !this.twigletNames.includes(c.value) ? null : {
      unique: {
        valid: false,
      }
    };
  }

  validateModelName(c: FormControl) {
    return this.modelIds.includes(c.value) ? null : {
      match: {
        valid: false
      }
    };
  }
}
