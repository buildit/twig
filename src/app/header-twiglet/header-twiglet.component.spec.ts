import { List, Map } from 'immutable';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { routerForTesting } from './../app.router';
import { StateService } from './../state.service';
import { stateServiceStub, fullTwigletMap, twigletsList, modelsList } from '../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { LoginButtonComponent } from './../login-button/login-button.component';
import { ChangelogListTwigletComponent } from './../changelog-list-twiglet/changelog-list-twiglet.component';
import { HeaderTwigletComponent } from './header-twiglet.component';

describe('HeaderTwigletComponent', () => {
  let component: HeaderTwigletComponent;
  let fixture: ComponentFixture<HeaderTwigletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangelogListTwigletComponent,
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
