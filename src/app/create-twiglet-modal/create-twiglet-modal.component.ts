import { clone } from 'ramda';
import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { Subscription } from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';

import { StateService } from '../state.service';

@Component({
  selector: 'app-twiglet-modal',
  styleUrls: ['./create-twiglet-modal.component.scss'],
  templateUrl: './create-twiglet-modal.component.html',
})
export class CreateTwigletModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  form: FormGroup;
  formErrors = {
    model: '',
    name: '',
  };
  validationMessages = {
    model: {
      required: 'A model from the list is required.',
    },
    name: {
      required: 'A name is required.',
      unique: 'A Twiglet with this name already exists! Please rename this Twiglet.'
    },
  };
  twiglets: any[];
  twigletNames: string[] = [];
  modelIds: string[] = [];
  twigletListSubscription: Subscription;
  modelListSubscription: Subscription;
  clone: Twiglet = {
    _id: '',
    name: '',
  };


  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              public stateService: StateService,
              public router: Router,
              public toastr: ToastsManager) { }

  ngOnInit() {
    this.buildForm();
    this.twigletListSubscription = this.stateService.twiglet.twiglets.subscribe(response => {
      this.twiglets = response.toJS();
      this.twigletNames = this.twiglets.map(twiglet => twiglet.name);
    });
    this.modelListSubscription = this.stateService.model.models.subscribe(response => {
      this.modelIds = response.toJS().map(model => model._id);
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  ngOnDestroy() {
    this.twigletListSubscription.unsubscribe();
    this.modelListSubscription.unsubscribe();
  }

  buildForm() {
    const self = this;
    const cloneTwiglet = this.fb.control(this.clone._id);
    const model = this.fb.control('N/A', [this.validateModels.bind(this)]);
    this.form = this.fb.group({
      cloneTwiglet,
      description: '',
      googlesheet: '',
      model,
      name: [this.clone._id ? `${this.clone.name} - copy` : '',
        [Validators.required, this.validateName.bind(this)]
      ],
    });
    cloneTwiglet.valueChanges.subscribe((cloneValue) => {
      if (cloneValue) {
        model.setValidators(null);
        model.reset();
      } else  {
        model.setValidators(this.validateModels.bind(this));
      }
    });
  }

  handleError(error) {
    console.error(error);
    const message = error._body ? JSON.parse(error._body).message : error.statusText;
    this.toastr.error(message, 'Server Error');
  }

  processForm() {
    if (this.form.valid) {
      this.form.value.commitMessage = this.clone._id ? `Cloned ${this.clone.name}` : 'Twiglet Created';
      this.form.value._id = 'twig-' + UUID.UUID();
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.activeModal.close();
        this.router.navigate(['twiglet', data._id]);
        this.toastr.success('Twiglet Created');
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

  validateModels(c: FormControl) {
    if (this.clone._id || this.modelIds.includes(c.value)) {
      return null;
    }
    return {
      required: {
        valid: false,
      }
    };
  }
}
