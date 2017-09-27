import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
  ViewChild, ElementRef, OnChanges, SimpleChanges, DoCheck, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

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
    },
  };
  EVENT = EVENT_CONSTANTS;
  eventsSubscription: Subscription;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, public stateService: StateService,
    public toastr: ToastsManager, private cd: ChangeDetectorRef) {
      this.eventsSubscription = stateService.twiglet.eventsService.events.subscribe(events => {
        this.eventsList = events;
      });
    }

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

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      availableEvents: this.eventsList.valueSeq,
      description: this.formStartValues.description || '',
      eventsInSequence: this.eventsList.valueSeq,
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
    this.stateService.twiglet.eventsService[this.typeOfSave](this.form.value).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success('Sequence successfully saved', null);
    }, handleError.bind(this));
  }

  addToSequence() {
    this.stateService.twiglet.eventsService.checkEvent(this.form.controls.availableEvents.value[0], true);
  }

  addAllToSequence() {
    this.stateService.twiglet.eventsService.setAllCheckedTo(true);
  }

  removeFromSequence() {
    this.stateService.twiglet.eventsService.checkEvent(this.form.controls.eventsInSequence.value[0], false);
  }

  removeAllFromSequence() {
    this.stateService.twiglet.eventsService.setAllCheckedTo(false);
  }
}
