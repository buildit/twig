import { List } from 'immutable';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { routerForTesting } from './../app.router';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { LoginButtonComponent } from './../login-button/login-button.component';
import { HeaderServerComponent } from './header-server.component';
import { ChangelogListComponent } from './../changelog-list/changelog-list.component';

describe('HeaderServerComponent', () => {
  let component: HeaderServerComponent;
  let fixture: ComponentFixture<HeaderServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangelogListComponent,
        HeaderServerComponent,
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
    fixture = TestBed.createComponent(HeaderServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
