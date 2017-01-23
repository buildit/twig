import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StateService, StateServiceStub } from '../state.service';
import { TwigletModalComponent } from './twiglet-modal.component';

describe('TwigletModalComponent', () => {
  let component: TwigletModalComponent;
  let fixture: ComponentFixture<TwigletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: new StateServiceStub()},
        NgbActiveModal,
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
