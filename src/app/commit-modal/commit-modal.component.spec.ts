/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { CommitModalComponent } from './commit-modal.component';
import { routerForTesting } from './../app.router';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('CommitModalComponent', () => {
  let component: CommitModalComponent;
  let fixture: ComponentFixture<CommitModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed},
        { provide: Router, useValue: routerForTesting },
        NgbActiveModal,
        FormBuilder,
        ToastsManager,
        ToastOptions,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit the form without a commit message', () => {
    component.activeTwiglet = true;
    component.form.controls['commit'].setValue(null);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'saveChanges');
    fixture.nativeElement.querySelector('.button').click();
    expect(stateServiceStubbed.twiglet.saveChanges).not.toHaveBeenCalled();
  });

  it('submits twiglet changes when a commit message is entered', () => {
    component.activeTwiglet = true;
    component.form.controls['commit'].setValue('commit message');
    spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
    component.saveChanges();
    expect(stateServiceStubbed.twiglet.saveChanges).toHaveBeenCalled();
  });

  it('submits model changes when a commit message is entered', () => {
    component.activeModel = true;
    component.form.controls['commit'].setValue('commit message');
    spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue({ subscribe: () => {} });
    component.saveChanges();
    expect(stateServiceStubbed.model.saveChanges).toHaveBeenCalled();
  });
});
