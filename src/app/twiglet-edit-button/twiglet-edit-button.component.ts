import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { UserState } from './../../non-angular/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { StateService } from './../state.service';
import { CommitModalComponent } from '../commit-modal/commit-modal.component';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-edit-button',
  styleUrls: ['./twiglet-edit-button.component.scss'],
  templateUrl: './twiglet-edit-button.component.html',
})
export class TwigletEditButtonComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'Name already taken.'
    },
  };
  twigletNames: string[] = [];
  twiglet: Twiglet = { };
  backendServiceSubscription: Subscription;
  twigletSubscription: Subscription;

  private userState: UserState = {};

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    public modalService: NgbModal,
    private cd: ChangeDetectorRef) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      commitMessage: ['', [Validators.required]],
      description: '',
      name: ['', [Validators.required, this.validateName.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.backendServiceSubscription = this.stateService.backendService.observable.subscribe(response => {
      this.twigletNames = response.get('twiglets').toJS().map(twiglet => twiglet.name);
    });
    this.twigletSubscription = this.stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet.toJS();
      this.form.patchValue({
        description: this.twiglet.description,
        name: this.twiglet.name,
      });
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }


  startEditing() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
  }

  discardChanges() {
    this.userState.isEditing = false;
    this.cd.markForCheck();
    this.stateService.userState.setEditing(false);
    this.stateService.twiglet.restoreBackup();
  }

  onValueChanged() {
    if (!this.form) { return; }
    this.stateService.twiglet.setName(this.form.value.name);
    this.stateService.twiglet.setDescription(this.form.value.description);
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

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

  validateName(c: FormControl) {
    return !this.twigletNames.includes(c.value) || c.value === this.twiglet.name ? null : {
      unique: {
        valid: false,
      }
    };
  }
}
