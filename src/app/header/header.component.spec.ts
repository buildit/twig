import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';
import { HeaderInfoBarComponent } from './../core/header-info-bar/header-info-bar.component';
import { LoginButtonComponent } from './../core/login-button/login-button.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderInfoBarComponent,
        LoginButtonComponent,
      ],
      imports: [
        NgbModule.forRoot(),
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { events: Observable.of() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
