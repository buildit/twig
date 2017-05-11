import { AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';

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
  fileString = '';
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
      googlesheet: new FormControl({ value: '', disabled: true }),
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
      this.form.value.json = this.fileString;
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
        this.router.navigate(['twiglet', this.form.value.name]);
        this.toastr.success('Twiglet Created');
      }, handleError.bind(this));
    }
  }

  getFiles(event) {
    const file = event.srcElement.files[0];
    const count = 0;
    const reader = new FileReader();
    reader.onload = (e: FileReaderEvent) => {
      this.fileString = e.target.result;
      this.form.controls.model.updateValueAndValidity();
    };
    reader.readAsText(file);
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
    if (this.clone.get('name') || this.fileString !== '' || this.modelNames.includes(c.value)) {
      return null;
    }
    return {
      required: {
        valid: false,
      }
    };
  }
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}
;
