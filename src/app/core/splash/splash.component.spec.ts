/* tslint:disable:no-unused-variable */
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

  beforeEach(async(() => {
    const stateServiceStubbed = stateServiceStub();
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
});
