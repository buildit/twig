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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, List } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';
import { TwigletService } from './../../../non-angular/services-helpers/twiglet/index';
import { Validators } from '../../../non-angular/utils/formValidators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-details',
  styleUrls: ['./edit-twiglet-details.component.scss'],
  templateUrl: './edit-twiglet-details.component.html',
})
export class EditTwigletDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
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

  /**
   * The subscription to our local twiglet
   *
   * @type {Subscription}
   * @memberOf EditTwigletDetailsComponent
   */
  twigletServiceSubsciption: Subscription;

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
        false,
        stateService.userState, null);
  }

  setupTwigletLists(twiglets: List<Object>) {
    this.twigletNames = twiglets.toJS().map(twiglet => twiglet.name);
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateUniqueName.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.stateService.twiglet.loadTwiglet(this.twigletName).subscribe(() => undefined);
    this.twigletServiceSubsciption = this.stateService.twiglet.observable.subscribe(twiglet => {
    if (twiglet && twiglet.get('name')) {
      this.form.patchValue({
        name: twiglet.get('name'),
      });
      if (this.twigletServiceSubsciption) {
        this.twigletServiceSubsciption.unsubscribe();
      }
      this.stateService.userState.stopSpinner();
    }
  });

  }

  ngOnDestroy() {
    this.twigletServiceSubsciption.unsubscribe();
  }

  processForm() {
    if (this.form.controls['name'].dirty) {
      this.stateService.twiglet.setName(this.form.value.name);
      this.stateService.twiglet.saveChanges(`"${this.twigletName}" renamed to "${this.form.value.name}"`)
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

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
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
