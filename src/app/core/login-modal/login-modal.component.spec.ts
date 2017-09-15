import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid'
import actions from '../../../non-angular/actions';

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

  describe('redirectToAdLogin', () => {
    let win = {
      location: {
        hostname: 'twig-test.buildit.tools',
        href: 'prot://twig-test.buildit.tools',
        port: 3000,
        protocol: 'prot:',
      }
    }
    beforeEach(() => {
      win = {
        location: {
          hostname: 'twig-test.buildit.tools',
          href: 'prot://twig-test.buildit.tools',
          port: 3000,
          protocol: 'prot:',
        }
      }
      spyOn(actions, 'getWindow').and.returnValue(win);
      spyOn(UUID, 'UUID').and.returnValue('a_uuid');
    });
    describe('redirects to the correct ad with no port', () => {
      beforeEach(() => {
        delete win.location.port;
        component.redirectToAdLogin();
      });

      it('heads to microsoft login', () => {
        expect(win.location.href).toContain('https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/oauth2/authorize?');
      });

      it('passes the correct client_id', () => {
        expect(win.location.href).toContain('client_id=51d1ec16-a264-4d39-9ae7-3f12fb508efa');
      });

      it('passes the correct redirect_uri', () => {
        expect(win.location.href).toContain('redirect_uri=prot://twig-test.buildit.tools/');
      });

      it('passes the correct state', () => {
        expect(win.location.href).toContain('state=%2Ftwiglet%2Ftesting');
      });

      it('passes the response type', () => {
        expect(win.location.href).toContain('response_type=id_token');
      });

      it('passes in a random nonce', () => {
        expect(win.location.href).toContain('nonce=a_uuid');
      });
    });

    describe('redirects to the correct ad with a port', () => {
      beforeEach(() => {
        component.redirectToAdLogin();
      });

      it('heads to microsoft login', () => {
        expect(win.location.href).toContain('https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/oauth2/authorize?');
      });

      it('passes the correct client_id', () => {
        expect(win.location.href).toContain('client_id=51d1ec16-a264-4d39-9ae7-3f12fb508efa');
      });

      it('passes the correct redirect_uri', () => {
        expect(win.location.href).toContain('redirect_uri=prot://twig-test.buildit.tools:3000/');
      });

      it('passes the correct state', () => {
        expect(win.location.href).toContain('state=%2Ftwiglet%2Ftesting');
      });

      it('passes the response type', () => {
        expect(win.location.href).toContain('response_type=id_token');
      });

      it('passes in a random nonce', () => {
        expect(win.location.href).toContain('nonce=a_uuid');
      });
    });
  });

  describe('updateRedirectMessage', () => {
    it('adds a single "." to the end when x is 0', () => {
      component.updateRedirectMessage(0);
      expect(component.redirectionMessage.endsWith('.')).toBeTruthy();
    });

    it('adds a two ".." to the end when x is 1', () => {
      component.updateRedirectMessage(1);
      expect(component.redirectionMessage.endsWith('..')).toBeTruthy();
    });

    it('adds a single "..." to the end when x is 2', () => {
      component.updateRedirectMessage(2);
      expect(component.redirectionMessage.endsWith('...')).toBeTruthy();
    });

    it('restarts back to a single "." to the end when x is > 2', () => {
      component.updateRedirectMessage(3);
      expect(component.redirectionMessage.endsWith('.')).toBeTruthy();
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
