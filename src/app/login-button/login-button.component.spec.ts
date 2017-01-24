/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginButtonComponent } from './login-button.component';
import { StateService, StateServiceStub } from '../state.service';

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginButtonComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ { provide: StateService, useValue: stateService}, NgbModal]
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
    stateService.userState.setCurrentUser(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-sign-in')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-sign-out')).toBeNull();
  });

  it('should display the sign out button when there is a user', () => {
    stateService.userState.setCurrentUser('user');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-sign-out')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-sign-in')).toBeNull();
  });

  it('logs out when the sign out button is clicked', () => {
    stateService.userState.setCurrentUser('user');
    fixture.detectChanges();
    spyOn(stateService.userState, 'logOut');
    fixture.nativeElement.querySelector('.fa-sign-out').click();
    expect(stateService.userState.logOut).toHaveBeenCalled();
  });
});
