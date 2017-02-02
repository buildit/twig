import { Observable } from 'rxjs';
import { routerForTesting } from './../app.router';
import { Router } from '@angular/router';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { HeaderInfoBarComponent } from './header-info-bar.component';

describe('HeaderInfoBarComponent', () => {
  let component: HeaderInfoBarComponent;
  let fixture: ComponentFixture<HeaderInfoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInfoBarComponent ],
      providers: [
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { events: Observable.of() } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
