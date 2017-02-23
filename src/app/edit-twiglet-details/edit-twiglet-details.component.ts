import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';
import { TwigletService } from './../../non-angular/services-helpers/twiglet/index';
import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { StateService } from './../state.service';
import { Subscription } from 'rxjs';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';
import { Map, List } from 'immutable';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '../../non-angular/utils/formValidators';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-details',
  styleUrls: ['./edit-twiglet-details.component.scss'],
  templateUrl: './edit-twiglet-details.component.html',
})
export class EditTwigletDetailsComponent implements OnInit, AfterViewChecked {
  currentTwigletOpenedName: string;
  /**
   * The initial twiglet name that is being edited.
   *
   * @type {string}
   * @memberOf EditTwigletDetailsComponent
   */
  twigletName: string;
  /**
   * The list of invalid names
   *
   * @type {string[]}
   * @memberOf EditTwigletDetailsComponent
   */
  twigletNames: string[] = [];
  /**
   * The twiglet service that holds the twiglet being renamed.
   *
   * @type {TwigletService}
   * @memberOf EditTwigletDetailsComponent
   */
  twigletService: TwigletService;

  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'Name already taken.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private router: Router,
    private toastr: ToastsManager) {
      this.twigletService = new TwigletService(
        stateService.http,
        stateService.toastr,
        stateService.router,
        stateService.modalService,
        false);
  }

  setupTwigletLists(twiglets: List<Object>) {
    this.twigletNames = twiglets.toJS().map(twiglet => twiglet.name);
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: '',
      name: ['', [Validators.required, this.validateUniqueName.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.twigletService.loadTwiglet(this.twigletName);
    const sub = this.twigletService.observable.subscribe(twiglet => {
      if (twiglet && twiglet.get('name')) {
        this.form.patchValue({
          description: twiglet.get('description'),
          name: twiglet.get('name'),
        });
        sub.unsubscribe();
      }
    });
  }

  processForm() {
    if (this.form.controls['name'].dirty || this.form.controls['description'].dirty) {
      this.twigletService.setName(this.form.value.name);
      this.twigletService.setDescription(this.form.value.description);
      const commitMessage = [];
      if (this.form.controls['name'].dirty) {
        commitMessage.push(`"${this.twigletName}" renamed to "${this.form.value.name}"`);
      }
      if (this.form.controls['description'].dirty) {
        commitMessage.push(`description updated`);
      }
      this.twigletService.saveChanges(commitMessage.join(' and '))
      .subscribe(response => {
        this.stateService.twiglet.updateListOfTwiglets();
        if (this.currentTwigletOpenedName === this.twigletName) {
          if (this.form.value.name !== this.twigletName) {
            this.router.navigate(['twiglet', this.form.value.name]);
          } else {
            this.stateService.twiglet.changeLogService.refreshChangelog();
          }
        }
        this.activeModal.close();
      }, handleError);
    } else {
      this.toastr.warning('Nothing changed');
    }
  }

  yes() {

  }

  no() {
    this.stateService.twiglet.updateListOfTwiglets();
    this.activeModal.close();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  updateDescription() {
    this.stateService.twiglet.setDescription(this.form.value.description);
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
          this.formErrors[key] = messages[error] + ' ';
        });
      }
    });
  }

  validateUniqueName(c: FormControl) {
    return !this.twigletNames.includes(c.value) || c.value === this.twigletName ? null : {
      unique: {
        valid: false,
      }
    };
  }
}
