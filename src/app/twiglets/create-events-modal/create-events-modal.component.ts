import { AfterViewChecked, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-events-modal',
  styleUrls: ['./create-events-modal.component.scss'],
  templateUrl: './create-events-modal.component.html',
})
export class CreateEventsModalComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  formErrors = {
    name: ''
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
    },
  };
  twiglet;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, public stateService: StateService,
    public toastr: ToastsManager) { }

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
      description: '',
      name: ['', [Validators.required]]
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
    this.stateService.twiglet.createEvent(this.form.value).subscribe(response => {
      this.activeModal.close();
      this.toastr.success('Event created');
    }, handleError.bind(this));
  }

}
