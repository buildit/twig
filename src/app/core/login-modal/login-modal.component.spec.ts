import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';

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
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot() ],
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
    it('redirects the user if the ends in any combination of ioprw.com', () => {
      spyOn(component, 'redirectToAdLogin').and.returnValue(undefined);
      component.checkForMothership('something@ioprw.com');
      expect(component.redirectToAdLogin).toHaveBeenCalled();
    });

    it('does no redirection for @corp.riglet.io emails', () => {
      spyOn(component, 'redirectToAdLogin').and.returnValue(undefined);
      component.checkForMothership('something@corp.riglet.io');
      expect(component.redirectToAdLogin).not.toHaveBeenCalled();
    });

    it('does no redirection for @user emails', () => {
      spyOn(component, 'redirectToAdLogin').and.returnValue(undefined);
      component.checkForMothership('something@user');
      expect(component.redirectToAdLogin).not.toHaveBeenCalled();
    });
  });

  it('logs the user in when the form is valid', () => {
    component.form.controls['email'].setValue('user@corp.riglet.io');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn').and.returnValue({ subscribe: () => {} });
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).toHaveBeenCalledWith({
      email: 'user@corp.riglet.io',
      password: 'password'
    });
  });

  it('does not let user log in if the email is invalid', () => {
    component.form.controls['email'].setValue('@corp.riglet.io');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn');
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).not.toHaveBeenCalled();
  });

  it('does not let user log in if the password is invalid', () => {
    component.form.controls['email'].setValue('test@corp.riglet.io');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logIn');
    fixture.nativeElement.querySelectorAll('button.button')[1].click();
    expect(stateServiceStubbed.userState.logIn).not.toHaveBeenCalled();
  });

  describe('rendering', () => {
    describe('mothership email address', () => {
      describe('mothership email address', () => {
        beforeEach(() => {
          component.mothership = true;
          fixture.detectChanges();
        });

        it('shows a redirecting message if the user types in a mothership email address', () => {
          expect(fixture.nativeElement.querySelector('.mothership-redirect')).toBeTruthy();
        });

        it('does not show the footer/submit buttons if a mothership email address', () => {
          expect(fixture.nativeElement.querySelector('.modal-footer')).toBeFalsy();
        });
      });

      describe('not a mothership email address', () => {
        beforeEach(() => {
          component.mothership = false;
          fixture.detectChanges();
        });

        it('does not show a redirecting message if the user types in a non-mothership email', () => {
          expect(fixture.nativeElement.querySelector('.mothership-redirect')).toBeFalsy();
        });

        it('shows the footer/submit button if the user has not typed in a mothership email', () => {
          expect(fixture.nativeElement.querySelector('.modal-footer')).toBeTruthy();
        });
      });
    })
  });
});
