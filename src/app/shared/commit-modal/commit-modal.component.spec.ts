/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CommitModalComponent } from './commit-modal.component';
import { routerForTesting } from './../../app.router';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('CommitModalComponent', () => {
  let component: CommitModalComponent;
  let fixture: ComponentFixture<CommitModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed},
        { provide: Router, useValue: { url: '/twiglet/somename' } },
        FormBuilder,
        NgbActiveModal,
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

  describe('setCommitMessage', () => {
    it('patches the commit message ', () => {
      component.setCommitMessage('this is a test');
      component.saveChanges(true);
      component.observable.subscribe(formResults => {
        expect(formResults.commit).toEqual('this is a test');
      });
    });
  });

  describe('saveChanges', () => {
    it('passes on the form results', () => {
      component.form.patchValue({ commit: 'some user entered commit message' });
      component.saveChanges(true);
      component.observable.subscribe(formResults => {
        expect(formResults.commit).toEqual('some user entered commit message');
      });
    });

    it('passes on if the user wants to continue editing', () => {
      component.saveChanges(true);
      component.observable.subscribe(formResults => {
        expect(formResults.continueEdit).toEqual(true);
      });
    });

    it('passes on if the user wants to stop editing', () => {
      component.saveChanges(false);
      component.observable.subscribe(formResults => {
        expect(formResults.continueEdit).toEqual(false);
      });
    });
  });

  describe('closeModal', () => {
    it('calls close', () => {
      spyOn(component.activeModal, 'close');
      component.closeModal();
      expect(component.activeModal.close).toHaveBeenCalled();
    });
  });

  describe('display', () => {
    it('does not display the continue editing button if displayContinueEdit is false', () => {
      expect(fixture.nativeElement.querySelectorAll('.btn-secondary')[1]).toBeUndefined();
    });

    it('displays the continue editing button if displayContinueEdit is true', () => {
      component.displayContinueEdit = true;
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.btn-secondary')[1]).toBeTruthy();
    });
  });
});
