import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { mockToastr, stateServiceStub } from '../../../non-angular/testHelpers';
import { SplashComponent } from './splash.component';
import { StateService } from './../../state.service';

describe('SplashComponent', () => {
  let component: SplashComponent;
  let fixture: ComponentFixture<SplashComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ SplashComponent ],
      providers: [
        { provide: Router, useValue: { url: 'some&url' } },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ToastsManager, useValue: mockToastr },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redirecting of mothership login', () => {
    let toastr = mockToastr();
    let stateService = {
      userState: {
        loginViaMothershipAd: jasmine.createSpy('loginViaMothershipAd').and.returnValue(Observable.of({ user: { name: 'name' } })),
      }
    }
    let router = {
      navigate: jasmine.createSpy('navigate'),
      url: '',
    }

    beforeEach(() => {
      toastr = mockToastr();
      stateService = {
        userState: {
          loginViaMothershipAd: jasmine.createSpy('loginViaMothershipAd').and.returnValue(Observable.of({ user: { name: 'name' } })),
        }
      }
      router = {
        navigate: jasmine.createSpy('navigate'),
        url: '/&id_token=someToken&session_state=whatever&state=%252ftwiglet%252fname'
      }
    });

    it('logs the user in', () => {
      const splash = new SplashComponent(<any>router, <any>stateService, <any>toastr);
      expect(stateService.userState.loginViaMothershipAd).toHaveBeenCalled();
    });

    it('toasts the logged in user', () => {
      const splash = new SplashComponent(<any>router, <any>stateService, <any>toastr);
      expect(toastr.success).toHaveBeenCalled()
    });

    it('navigates to the correct stored location', () => {
      const splash = new SplashComponent(<any>router, <any>stateService, <any>toastr);
      expect(router.navigate).toHaveBeenCalledWith(['', 'twiglet', 'name']);
    });

    it('navigates to home if there are no stored params', () => {
      router.url = '/&id_token=someToken&session_state=whatever&state='
      const splash = new SplashComponent(<any>router, <any>stateService, <any>toastr);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

});
