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
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed},
        { provide: Router, useValue: { url: '/twiglet/somename' } },
        NgbActiveModal,
        FormBuilder,
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

  describe('twiglet commits', () => {
    it('sets active twiglet if the url starts with twiglet', () => {
      expect(component.activeTwiglet).toEqual(true);
    });

    it('sets the active model to false if the url starts with twiglet', () => {
      expect(component.activeModel).toEqual(false);
    });

    it('does not submit the form without a commit message', () => {
      component.form.controls['commit'].setValue(null);
      fixture.detectChanges();
      spyOn(stateServiceStubbed.twiglet, 'saveChanges');
      fixture.nativeElement.querySelector('.button').click();
      expect(stateServiceStubbed.twiglet.saveChanges).not.toHaveBeenCalled();
    });

    it('submits twiglet changes when a commit message is entered', () => {
      component.form.controls['commit'].setValue('commit message');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
      component.saveChanges();
      expect(stateServiceStubbed.twiglet.saveChanges).toHaveBeenCalled();
    });

    it('sets the editing mode to false when a commit is saved', () => {
      component.form.controls['commit'].setValue('commit message');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(stateServiceStubbed.userState, 'setEditing');
      component.saveChanges();
      expect(stateServiceStubbed.userState.setEditing).toHaveBeenCalledWith(false);
    });

    it('returns an error message if there is an error while saving', () => {
      spyOn(console, 'error');
      component.form.controls['commit'].setValue('commit message');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.throw({statusText: 'whatever'}));
      component.saveChanges();
      expect(component.errorMessage).toEqual('Something went wrong saving your changes.');
    });
  });

  describe('model commits', () => {
    beforeEach(() => {
      component.activeModel = true;
      component.activeTwiglet = false;
      fixture.detectChanges();
    });

     it('sets active model if the url starts with model', () => {
      expect(component.activeModel).toEqual(true);
    });

    it('submits model changes when a commit message is entered', () => {
      component.form.controls['commit'].setValue('commit message');
      spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue({ subscribe: () => {} });
      component.saveChanges();
      expect(stateServiceStubbed.model.saveChanges).toHaveBeenCalled();
    });

    it('sets the editing mode to false when a commit is saved', () => {
      component.form.controls['commit'].setValue('commit message');
      spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(stateServiceStubbed.userState, 'setEditing');
      component.saveChanges();
      expect(stateServiceStubbed.userState.setEditing).toHaveBeenCalledWith(false);
    });
  });
});
