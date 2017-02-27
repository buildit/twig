import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { Validators } from '../../non-angular/utils/formValidators';

@Component({
  selector: 'app-login-modal',
  styleUrls: ['./login-modal.component.scss'],
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit {
  form: FormGroup;
  errorMessage;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private stateService: StateService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail]],
      password: ['', Validators.required]
    });
  }

  logIn() {
    if (this.form.valid) {
      this.stateService.userState.logIn(this.form.value).subscribe(response => {
        this.stateService.userState.setCurrentUser(this.form.value.email);
        this.activeModal.close();
      },
      error => this.errorMessage = 'Username or password is incorrect.');
    }
  }

  validateEmail(c: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  }

}
