import { AfterViewChecked, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

interface FormStartValues {
  description?: string;
  id?: string;
  name?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-events-and-seq-modal',
  styleUrls: ['./edit-events-and-seq-modal.component.scss'],
  templateUrl: './edit-events-and-seq-modal.component.html',
})
export class EditEventsAndSeqModalComponent implements OnInit, AfterViewChecked {
  /**
   * This modal edits and creates both events and sequences, depending on initial user input.
   *
   * It defaults its initial variables to creating a new event, but has different initial set up
   * variables if user wants to create or edit a sequence.
   */
  typeOfSave = 'createEvent';
  id: string;
  successMessage = 'Event created';
  title = 'Create New Event';
  description = '';
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

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, public stateService: StateService,
    public toastr: ToastsManager, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: this.formStartValues.description || '',
      id: this.formStartValues.id || '',
      name: [ this.formStartValues.name || '', [Validators.required]]
    });
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

  processForm() {
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.eventsService[this.typeOfSave](this.form.value).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success(this.successMessage);
    }, handleError.bind(this));
  }

}
