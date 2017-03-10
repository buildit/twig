import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { List, Map } from 'immutable';

import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { fullTwigletMap, modelsList, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { HeaderTwigletComponent } from './header-twiglet.component';
import { LoginButtonComponent } from './../../core/login-button/login-button.component';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';

describe('HeaderTwigletComponent', () => {
  let component: HeaderTwigletComponent;
  let fixture: ComponentFixture<HeaderTwigletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangelogListComponent,
        HeaderTwigletComponent,
        LoginButtonComponent,
        TwigletDropdownComponent
      ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        NgbModal,
        ToastsManager,
        ToastOptions,
        { provide: StateService, useValue: stateServiceStub() },
        { provide: Router, useValue: routerForTesting }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTwigletComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      mode: 'twiglet',
    });
    component.twiglet = fullTwigletMap();
    component.twiglets = twigletsList();
    component.models = modelsList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
