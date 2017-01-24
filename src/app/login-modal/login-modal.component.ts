import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../state.service';

@Component({
  selector: 'app-login-modal',
  styleUrls: ['./login-modal.component.scss'],
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit {
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private stateService: StateService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }

  logIn() {
    if (this.form.valid) {
      this.stateService.userState.logIn(this.form.value);
      this.activeModal.close();
    }
  }

}
