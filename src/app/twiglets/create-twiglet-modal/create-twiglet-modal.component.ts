import { AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

@Component({
  selector: 'app-twiglet-modal',
  styleUrls: ['./create-twiglet-modal.component.scss'],
  templateUrl: './create-twiglet-modal.component.html',
})
export class CreateTwigletModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
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
      slash: '/, ? characters are not allowed.',
      unique: 'A Twiglet with this name already exists! Please rename this Twiglet.'
    },
  };
  twiglets: any[];
  twigletNames: string[] = [];
  modelNames: string[] = [];
  clone: Map<string, any> = Map({
    name: '',
  });
  TWIGLET = TWIGLET_CONSTANTS;

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
    this.elementRef.nativeElement.focus();
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
      return true;
    }
    return false;
  }

  /**
   * Setup the form.
   *
   *
   * @memberOf CreateTwigletModalComponent
   */
  buildForm() {
    const self = this;
    const model = this.fb.control('N/A', [this.validateModels.bind(this)]);
    this.form = this.fb.group({
      description: '',
      model,
      name: [this.clone.get(this.TWIGLET.NAME) ? `${this.clone.get(this.TWIGLET.NAME)} - copy` : '',
        [Validators.required, this.validateName.bind(this), this.validateSlash.bind(this)]
      ],
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
      this.form.value.commitMessage = this.clone.get(this.TWIGLET.NAME) ? `Cloned ${this.clone.get(this.TWIGLET.NAME)}` : 'Twiglet Created';
      this.form.value.json = this.fileString;
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
        this.router.navigate(['twiglet', this.form.value.name]);
        this.toastr.success('Twiglet Created', null);
      }, handleError.bind(this));
      return true;
    }
    return false;
  }

  getFiles(event) {
    const file = event.srcElement.files[0];
    const count = 0;
    const reader = new FileReader();
    reader.onload = (e: FileReaderEvent) => {;
      this.fileString = e.target.result;
      this.form.controls.model.updateValueAndValidity();
    };
    try {
      reader.readAsText(file);
    } catch (error) {
      this.fileString = '';
      this.form.controls.model.updateValueAndValidity();
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
    return true;
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

  validateSlash(c: FormControl) {
    if ((c.value && c.value.includes('/')) || (c.value && c.value.includes('?'))) {
      return {
        slash: {
          valid: false
        }
      };
    }
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
    if (this.clone.get(this.TWIGLET.NAME) || this.fileString !== '' || this.modelNames.includes(c.value)) {
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
