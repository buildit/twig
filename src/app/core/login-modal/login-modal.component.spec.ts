import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
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

  describe('ngOnDestroy', () => {
    it('unsubscribes if there is a subscription', () => {
      component.redirectionSubscription = <any>{
        unsubscribe: jasmine.createSpy('unsubscribe'),
      };
      component.ngOnDestroy();
      expect(component.redirectionSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('does not error if there is no subscription', () => {
      component.redirectionSubscription = undefined;
      expect(component.ngOnDestroy.bind(component)).not.toThrow();
    });
  });

  describe('logIn', () => {
    const rs = new ReplaySubject();
    beforeEach(() => {
      spyOn(stateServiceStubbed.userState, 'logIn').and.returnValue(rs.asObservable());
    });

    it('does not do anything if the form is not valid', () => {
      component.form = <any>{ valid: false };
      component.logIn();
      expect(stateServiceStubbed.userState.logIn).not.toHaveBeenCalled();
    });

    it('logs in if the form is valid', () => {
      component.form = <any>{ valid: true, value: 'some login info' };
      component.logIn();
      expect(stateServiceStubbed.userState.logIn).toHaveBeenCalled();
    });

    it('closes the modal if login is successful', () => {
      component.form = <any>{ valid: true, value: 'some login info' };
      spyOn(component.activeModal, 'close');
      component.logIn();
      rs.next({});
      expect(component.activeModal.close).toHaveBeenCalled();
    });

    it('shows the user an error message if login is unsuccessful', () => {
      component.form = <any>{ valid: true, value: 'some login info' };
      spyOn(component.activeModal, 'close');
      component.logIn();
      rs.error('some error');
      expect(component.errorMessage).not.toBeNull();
    });
  });

  describe('checkForMothership', () => {
    it('redirects the user if the email is not @corp.riglet.io or @user', () => {
      spyOn(component, 'redirectToAdLogin');
      component.checkForMothership('something@anotherdomain.com');
      expect(component.redirectToAdLogin).toHaveBeenCalled();
    });

    it('does no redirection for @corp.riglet.io emails', () => {
      spyOn(component, 'redirectToAdLogin');
      component.checkForMothership('something@corp.riglet.io');
      expect(component.redirectToAdLogin).not.toHaveBeenCalled();
    });

    it('does no redirection for @user emails', () => {
      spyOn(component, 'redirectToAdLogin');
      component.checkForMothership('something@user');
      expect(component.redirectToAdLogin).not.toHaveBeenCalled();
    });
  });

  describe('onFocusOut', () => {
    it('calls checkforMothership', () => {
      spyOn(component, 'checkForMothership');
      component.onFocusOut({});
      expect(component.checkForMothership).toHaveBeenCalled();
    });
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
