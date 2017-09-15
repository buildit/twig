import { Component, HostListener, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { range } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';

import actions from '../../../non-angular/actions';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errorMessage;
  mothership = false;
  redirectionMessage = 'Redirecting';
  redirectionSubscription: Subscription;
  routeSubscription: Subscription;
  @ViewChild('autofocus') private elementRef: ElementRef;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private stateService: StateService,
      private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy() {
    if (this.redirectionSubscription) {
      this.redirectionSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.form.controls.email.valueChanges.subscribe(this.checkForMothership.bind(this));
  }

  logIn() {
    if (this.form.valid) {
      this.stateService.userState.logIn(this.form.value).subscribe(() => {
        this.activeModal.close();
      },
      error => this.errorMessage = 'Username or password is incorrect.');
    }
  }

  checkForMothership(email: string) {
    const matcher = new RegExp(/.[ioprw]{5}.com/i);
    if (matcher.test(email)) {
      this.mothership = true;
      this.redirectionSubscription = Observable.interval(100).subscribe(this.updateRedirectMessage.bind(this));
      this.redirectToAdLogin();
    }
  }

  redirectToAdLogin() {
    const win = actions.getWindow();
    const rootUrl = `${win.location.protocol}//${win.location.hostname}${win.location.port ? `:${win.location.port}` : ''}/`;
    win.location.href = 'https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/oauth2/' +
        `authorize?client_id=51d1ec16-a264-4d39-9ae7-3f12fb508efa&redirect_uri=${rootUrl}` +
        `&state=${encodeURIComponent(this.router.url)}&response_type=id_token&nonce=${UUID.UUID()}`;
  }

  updateRedirectMessage(x: number) {
    this.redirectionMessage = `Redirecting.${range(0, x % 3).reduce((s) => `${s}.`, '')}`;
  }
}


