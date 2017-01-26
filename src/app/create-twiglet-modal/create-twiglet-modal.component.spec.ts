/* tslint:disable:no-unused-variable */
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { routerForTesting } from './../app.router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { CreateTwigletModalComponent } from './create-twiglet-modal.component';

describe('CreateTwigletModalComponent', () => {
  let component: CreateTwigletModalComponent;
  let fixture: ComponentFixture<CreateTwigletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTwigletModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [
        { provide: Router, useValue: routerForTesting},
        { provide: StateService, useValue: stateServiceStub()},
        NgbActiveModal,
        FormBuilder,
        ToastsManager,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTwigletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
