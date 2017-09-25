import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import EVENT_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/event';

interface FormStartValues {
  description?: string;
  id?: string;
  name?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-sequence-modal',
  styleUrls: ['./edit-sequence-modal.component.scss'],
  templateUrl: './edit-sequence-modal.component.html',
})
export class EditSequenceModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  typeOfSave = 'createSequence';
  eventsList;
  id: string;
  formStartValues: FormStartValues = {};
  form: FormGroup;
  formErrors = {
    name: ''
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
    },
  };
  EVENT = EVENT_CONSTANTS;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, public stateService: StateService,
    public toastr: ToastsManager, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
      return true;
    }
    return false;
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: this.formStartValues.description || '',
      id: this.formStartValues.id || '',
      name: [this.formStartValues.name || '', [Validators.required]]
    });
  }

  onValueChanged() {
    if (!this.form) { return false; }
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

  processForm() {
    console.log('process');
  }
}
