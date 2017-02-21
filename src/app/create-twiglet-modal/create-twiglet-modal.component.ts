import { List, Map } from 'immutable';
import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { Subscription } from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '../../non-angular/utils/formValidators';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';

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
      required: 'A model from the list is required.',
    },
    name: {
      required: 'A name is required.',
      unique: 'A Twiglet with this name already exists! Please rename this Twiglet.'
    },
  };
  twiglets: any[];
  twigletNames: string[] = [];
  modelNames: string[] = [];
  twigletListSubscription: Subscription;
  modelListSubscription: Subscription;
  clone: Map<string, any> = Map({
    name: '',
  });


  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              public stateService: StateService,
              public router: Router,
              public toastr: ToastsManager) { }

  /**
   * Allows the passing in of the list of twiglet names and model names. Avoids an unnecessary sub.
   *
   * @param {List<Object>} twiglets the immutable list of twiglets.
   * @param {List<Object>} models the immutable list of modesl
   *
   * @memberOf CreateTwigletModalComponent
   */
  setupTwigletAndModelLists(twiglets: List<Object>, models: List<Object>) {
    this.twiglets = twiglets.toJS();
    this.twigletNames = this.twiglets.map(twiglet => twiglet.name);
    this.modelNames = models.toJS().map(model => model.name);
  }

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Check form for validity.
   *
   *
   * @memberOf CreateTwigletModalComponent
   */
  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  /**
   * Setup the form.
   *
   *
   * @memberOf CreateTwigletModalComponent
   */
  buildForm() {
    const self = this;
    const cloneTwiglet = this.fb.control(this.clone.get('name'));
    const model = this.fb.control('N/A', [this.validateModels.bind(this)]);
    this.form = this.fb.group({
      cloneTwiglet,
      description: '',
      googlesheet: '',
      model,
      name: [this.clone.get('name') ? `${this.clone.get('name')} - copy` : '',
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

  /**
   * Gets called when the user submits the form.
   *
   *
   * @memberOf CreateTwigletModalComponent
   */
  processForm() {
    if (this.form.valid) {
      this.form.value.commitMessage = this.clone.get('name') ? `Cloned ${this.clone.get('name')}` : 'Twiglet Created';
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.activeModal.close();
        this.router.navigate(['twiglet', data.name]);
        this.toastr.success('Twiglet Created');
      }, handleError.bind(this));
    }
  }

  /**
   * Checks form is valid and if not displays error messages.
   *
   * @returns
   *
   * @memberOf CreateTwigletModalComponent
   */
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

  /**
   * Checks the the name is not an existing name.
   *
   * @param {FormControl} c
   * @returns
   *
   * @memberOf CreateTwigletModalComponent
   */
  validateName(c: FormControl) {
    return !this.twigletNames.includes(c.value) ? null : {
      unique: {
        valid: false,
      }
    };
  }

  /**
   * Checks that the model is one of the existing models.
   *
   * @param {FormControl} c
   * @returns
   *
   * @memberOf CreateTwigletModalComponent
   */
  validateModels(c: FormControl) {
    if (this.clone.get('name') || this.modelNames.includes(c.value)) {
      return null;
    }
    return {
      required: {
        valid: false,
      }
    };
  }
}
