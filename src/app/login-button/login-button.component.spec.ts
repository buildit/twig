/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginButtonComponent } from './login-button.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginButtonComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ { provide: StateService, useValue: stateServiceStubbed }, NgbModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sign in button when there is no user', () => {
    stateServiceStubbed.userState.setCurrentUser(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-sign-in')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-sign-out')).toBeNull();
  });

  it('should display the sign out button when there is a user', () => {
    stateServiceStubbed.userState.setCurrentUser('user');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-sign-out')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-sign-in')).toBeNull();
  });

  it('logs out when the sign out button is clicked', () => {
    stateServiceStubbed.userState.setCurrentUser('user');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'logOut');
    fixture.nativeElement.querySelector('.fa-sign-out').click();
    expect(stateServiceStubbed.userState.logOut).toHaveBeenCalled();
  });
});
