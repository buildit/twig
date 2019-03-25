import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
  ViewChild, ElementRef, OnChanges, SimpleChanges, DoCheck, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
export class EditSequenceModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('autofocus') private elementRef: ElementRef;
  eventsList;
  typeOfSave = 'createSequence';
  id: string;
  formStartValues: FormStartValues = {};
  form: FormGroup;
  formErrors = {
    name: ''
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'Names must be unique.',
    },
  };
  sequenceNames = [];
  EVENT = EVENT_CONSTANTS;
  eventsSubscription: Subscription;
  sequencesSubscription: Subscription;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, public stateService: StateService,
    public toastr: ToastrService, private cd: ChangeDetectorRef) {
    this.eventsSubscription = stateService.twiglet.eventsService.events.subscribe(events => {
      this.eventsList = events;
    });
  }

  ngOnInit() {
    this.buildForm();
    this.sequencesSubscription = this.stateService.twiglet.eventsService.sequences.subscribe(sequences => {
      this.sequenceNames = sequences.toJS()
      .filter(sequence => sequence.name !== this.formStartValues.name)
      .map(sequence => sequence.name);
    });
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.sequencesSubscription.unsubscribe();
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      availableEvents: this.eventsList.valueSeq,
      description: this.formStartValues.description || '',
      eventsInSequence: this.eventsList.valueSeq,
      id: this.formStartValues.id || '',
      name: [this.formStartValues.name || '', [Validators.required, this.validateUniqueName.bind(this)]]
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
    this.stateService.twiglet.eventsService[this.typeOfSave](this.form.value).subscribe(response => {
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success('Sequence successfully saved', null);
    }, handleError.bind(this));
  }

  validateUniqueName(c: FormControl) {
    return !this.sequenceNames.includes(c.value) ? null : {
      unique: {
        valid: false,
      }
    };
  }

  close() {
    this.stateService.twiglet.eventsService.restoreBackup();
    this.activeModal.close('Close click');
  }

  addToSequence() {
    this.form.controls.availableEvents.value.forEach(event => {
      this.stateService.twiglet.eventsService.checkEvent(event, true);
    });
  }

  addAllToSequence() {
    this.stateService.twiglet.eventsService.setAllCheckedTo(true);
  }

  removeFromSequence() {
    this.form.controls.eventsInSequence.value.forEach(event => {
      this.stateService.twiglet.eventsService.checkEvent(event, false);
    });
  }

  removeAllFromSequence() {
    this.stateService.twiglet.eventsService.setAllCheckedTo(false);
  }
}
