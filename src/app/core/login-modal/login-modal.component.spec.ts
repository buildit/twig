import { Router } from '@angular/router';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalComponent } from './login-modal.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { url: '/twiglet/testing' } },
        NgbActiveModal,
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logs the user in when the form is valid', () => {
    component.form.controls['email'].setValue('user@email.com');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn').and.returnValue({ subscribe: () => {} });
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: 'password'
    });
  });

  it('does not let user log in if the email is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn');
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).not.toHaveBeenCalled();
  });

  it('does not let user log in if the password is invalid', () => {
    component.form.controls['email'].setValue('user@email.com');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn');
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).not.toHaveBeenCalled();
  });
});
