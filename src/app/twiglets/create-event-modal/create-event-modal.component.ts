import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-event-modal',
  styleUrls: ['./create-event-modal.component.scss'],
  templateUrl: './create-event-modal.component.html',
})
export class CreateEventModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  id: string;
  description = '';
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
      description: '',
      id: '',
      name: ['', [Validators.required]]
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
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.eventsService.createEvent(this.form.value).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success('Event created', null);
    }, handleError.bind(this));
  }

}
