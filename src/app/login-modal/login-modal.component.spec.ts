/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalComponent } from './login-modal.component';
import { StateService, StateServiceStub } from '../state.service';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateService},
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
    spyOn(stateService.userState, 'logIn').and.returnValue({ subscribe: () => {} });
    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(stateService.userState.logIn).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: 'password'
    });
  });

  it('does not let user log in if form is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    spyOn(stateService.userState, 'logIn');
    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(stateService.userState.logIn).not.toHaveBeenCalled();
  });
});
