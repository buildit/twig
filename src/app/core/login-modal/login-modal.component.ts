import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { range } from 'ramda';
import { UUID } from 'angular2-uuid';

import { StateService } from '../../state.service';

@Component({
  selector: 'app-login-modal',
  styleUrls: ['./login-modal.component.scss'],
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errorMessage;
  wipro = false;
  redirectionMessage = 'Redirecting';
  redirectionSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private stateService: StateService,
      private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.redirectionSubscription) {
      this.redirectionSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail]],
      password: ['', Validators.required]
    });
    this.form.controls.email.valueChanges.subscribe(this.checkForWipro.bind(this));
  }

  logIn() {
    if (this.form.valid) {
      this.stateService.userState.logIn(this.form.value).subscribe(response => {
        this.activeModal.close();
      },
      error => this.errorMessage = 'Username or password is incorrect.');
    }
  }

  checkForWipro(email: string) {
    if (email.endsWith('@wipro.com')) {
      this.wipro = true;
      this.redirectionSubscription = Observable.interval(100).subscribe(x => {
        this.redirectionMessage = `Redirecting.${range(0, x % 3).reduce((s) => `${s}.`, '')}`;
      });
      window.location.href = 'https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/oauth2/' +
        'authorize?client_id=ce2abe9c-2019-40b2-8fbc-651a6157e956&redirect_uri=http%3A//localhost:4200' +
        `&state=${encodeURIComponent(this.router.url)}&response_type=id_token&nonce=${UUID.UUID()}`;
    }
  }

  validateEmail(c: FormControl) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  }

}
