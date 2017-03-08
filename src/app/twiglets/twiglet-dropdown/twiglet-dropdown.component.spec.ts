/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { TwigletDropdownComponent } from './twiglet-dropdown.component';
import { StateService } from '../../state.service';
import { stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { routerForTesting } from './../../app.router';

describe('TwigletDropdownComponent', () => {
  let component: TwigletDropdownComponent;
  let fixture: ComponentFixture<TwigletDropdownComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletDropdownComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: routerForTesting },
        ToastsManager,
        ToastOptions,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletDropdownComponent);
    component = fixture.componentInstance;
    component.twiglets = twigletsList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
