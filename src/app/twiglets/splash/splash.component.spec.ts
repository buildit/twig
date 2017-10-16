import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { mockToastr, stateServiceStub } from '../../../non-angular/testHelpers';
import { SplashComponent } from './splash.component';
import { StateService } from './../../state.service';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';
import { DismissibleHelpModule } from '../../directives/dismissible-help/dismissible-help.module';

fdescribe('SplashComponent', () => {
  let component: SplashComponent;
  let fixture: ComponentFixture<SplashComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ SplashComponent, TwigletDropdownComponent, DismissibleHelpDialogComponent ],
      imports: [
        NgbModule.forRoot(),
        DismissibleHelpModule
      ],
      providers: [
        NgbModal,
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
    let router = {
      navigate: jasmine.createSpy('navigate'),
      url: '',
    }
    let cd = {
      markForCheck: jasmine.createSpy('markForCheck'),
    }

    beforeEach(() => {
      toastr = mockToastr();
      spyOn(stateServiceStubbed.userState, 'loginViaMothershipAd').and.returnValue(Observable.of({ user: { name: 'name' } }));
      router = {
        navigate: jasmine.createSpy('navigate'),
        url: '/&id_token=someToken&session_state=whatever&state=%252ftwiglet%252fname'
      }
      cd = {
        markForCheck: jasmine.createSpy('markForCheck'),
      };
    });

    it('logs the user in', () => {
      const splash = new SplashComponent(<any>router, <any>stateServiceStubbed, <any>toastr, <any>cd, <any>{});
      expect(stateServiceStubbed.userState.loginViaMothershipAd).toHaveBeenCalled();
    });

    it('toasts the logged in user', () => {
      const splash = new SplashComponent(<any>router, <any>stateServiceStubbed, <any>toastr, <any>cd, <any>{});
      expect(toastr.success).toHaveBeenCalled()
    });

    it('navigates to the correct stored location', () => {
      const splash = new SplashComponent(<any>router, <any>stateServiceStubbed, <any>toastr, <any>cd, <any>{});
      expect(router.navigate).toHaveBeenCalledWith(['', 'twiglet', 'name']);
    });

    it('navigates to home if there are no stored params', () => {
      router.url = '/&id_token=someToken&session_state=whatever&state='
      const splash = new SplashComponent(<any>router, <any>stateServiceStubbed, <any>toastr, <any>cd, <any>{});
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('display', () => {
    it('if not logged in user just sees twiglet dropdown menu', () => {
      component.userState = Map({
        user: null,
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.box').length).toBe(1);
    });

    it('if logged in user sees twiglet dropdown menu and new twiglet options', () => {
      component.userState = Map({
        user: 'user',
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.box').length).toBe(2);
    });
  });

  describe('opening new twiglet modal', () => {
    it('has use existing model selected by default', () => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: { setupTwigletAndModelLists: () => {}, useModel: true, }
      });
      fixture.nativeElement.querySelector('.button').click();
      expect(component.modalService.open).toHaveBeenCalledWith(CreateTwigletModalComponent);
    });

    it('opens the create twiglet modal component with json option if selected', () => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: { setupTwigletAndModelLists: () => {}, fileString: 'json', }
      });
      component.switchTwigletTypeToCreate('json');
      component['cd'].markForCheck();
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.button').click();
      expect(component.modalService.open).toHaveBeenCalledWith(CreateTwigletModalComponent);
    });
  });
});
