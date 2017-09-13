import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';
import { LoginButtonComponent } from './../core/login-button/login-button.component';
import { routerForTesting } from './../app.router';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, LoginButtonComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the home page as the active page', () => {
    component.userState = Map({
      mode: 'home',
      user: null
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.nav-link.home.active')).toBeTruthy();
  });

  it('changes the active nav item depending on mode', () => {
    component.userState = Map({
      mode: 'twiglet',
      user: null
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.nav-link.home.active')).toBeNull();
    expect(fixture.nativeElement.querySelector('.nav-link.twiglet.active')).toBeTruthy();
  });

  it('sign in button displays the conditional sign in class if no user', () => {
    component.userState = Map({
      mode: 'home',
      user: null
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.nav-link.sign-in')).toBeTruthy();
  });

  it('does not display the sign in class if there is a user', () => {
    component.userState = Map({
      mode: 'home',
      user: 'user'
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.nav-link.sign-in')).toBeNull();
  });
});
