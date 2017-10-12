import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';
import { LoginButtonComponent } from './../core/login-button/login-button.component';
import { routerForTesting } from './../app.router';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

@Component({
  selector: 'app-dummy-component',
  template: `
    <div></div>
  `
})
class DummyComponent { }

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        LoginButtonComponent,
        DummyComponent
      ],
      imports: [
        NgbModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            component: DummyComponent,
            path: '',
          }
        ]),
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
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

  it('normally links to the twiglet start page', () => {
    fixture.detectChanges();
    const link = <HTMLAnchorElement>fixture.nativeElement.querySelector('a.twiglet');
    expect(link.getAttribute('href')).toEqual('/')
  });

  it('links to the specific twiglet if it has been loaded', () => {
    stateServiceStubbed.twiglet['_twiglet'].next(fromJS({ name: 'name1' }));
    fixture.detectChanges();
    const link = <HTMLAnchorElement>fixture.nativeElement.querySelector('a.twiglet');
    expect(link.getAttribute('href')).toEqual('/twiglet/name1')
  });

  it('normally links to the model start page', () => {
    fixture.detectChanges();
    const link = <HTMLAnchorElement>fixture.nativeElement.querySelector('a.model');
    expect(link.getAttribute('href')).toEqual('/model')
  });

  it('links to the specific model if it has been loaded', () => {
    stateServiceStubbed.model['_model'].next(fromJS({ name: 'name1' }));
    fixture.detectChanges();
    const link = <HTMLAnchorElement>fixture.nativeElement.querySelector('a.model');
    expect(link.getAttribute('href')).toEqual('/model/name1')
  });
});
