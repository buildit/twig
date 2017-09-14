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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-rename-twiglet-modal',
  styleUrls: ['./rename-twiglet-modal.component.scss'],
  templateUrl: './rename-twiglet-modal.component.html',
})
export class RenameTwigletModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  /**
   * The initial twiglet name that is being edited.
   *
   * @type {string}
   * @memberOf RenameTwigletModalComponent
   */
  twigletName: string;
  /**
   * The current twiglet that is opened.
   *
   * @type {string}
   * @memberOf RenameTwigletModalComponent
   */
  currentTwiglet: string;
  /**
   * The list of invalid names
   *
   * @type {string[]}
   * @memberOf RenameTwigletModalComponent
   */
  twigletNames: string[] = [];
  /**
   * The twiglet service that holds the twiglet being renamed.
   *
   * @type {TwigletService}
   * @memberOf RenameTwigletModalComponent
   */
  twigletService: TwigletService;

  /**
   * The subscription to our local twiglet
   *
   * @type {Subscription}
   * @memberOf RenameTwigletModalComponent
   */
  twigletServiceSubsciption: Subscription;

  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      slash: '/, ? characters are not allowed.',
      unique: 'Name already taken.',
    },
  };
  TWIGLET = TWIGLET_CONSTANTS;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private router: Router,
    public toastr: ToastsManager) {
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
      name: ['', [Validators.required, this.validateUniqueName.bind(this), this.validateSlash.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    // if the currently loaded twiglet doesn't match the selected twiglet to rename,
    // change the currently loaded twiglet through router
    if (this.currentTwiglet !== this.twigletName) {
      this.router.navigate(['/twiglet', this.twigletName]);
    }
    this.twigletServiceSubsciption = this.stateService.twiglet.observable.subscribe(twiglet => {
      if (twiglet && twiglet.get(this.TWIGLET.NAME)) {
        this.form.patchValue({
          name: twiglet.get(this.TWIGLET.NAME),
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
        this.router.navigate(['twiglet', this.form.value.name]);
        this.stateService.twiglet.changeLogService.refreshChangelog();
        this.activeModal.close();
      }, handleError);
    } else {
      this.toastr.warning('Nothing changed', null);
    }
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
      return true;
    }
    return false;
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
          this.formErrors[key] = messages[error] + ' ';
        });
      }
    });
    return true;
  }

  validateUniqueName(c: FormControl) {
    return !this.twigletNames.includes(c.value) || c.value === this.twigletName ? null : {
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
}
