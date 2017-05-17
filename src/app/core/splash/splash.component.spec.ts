/* tslint:disable:no-unused-variable */
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StateService } from './../../state.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';

import { SplashComponent } from './splash.component';

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
