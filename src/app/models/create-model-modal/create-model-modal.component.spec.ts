/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { CreateModelModalComponent } from './create-model-modal.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('CreateModelModalComponent', () => {
  let component: CreateModelModalComponent;
  let fixture: ComponentFixture<CreateModelModalComponent>;
  let stateServiceStubbed: StateService;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        CreateModelModalComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal,
        ToastsManager,
        ToastOptions,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitting the form', () => {
    beforeEach(() => {
      component.modelNames = ['model1', 'model2'];
    });

    it('does not submit the form if the model name is not unique', () => {
      component.form.controls['name'].patchValue('model1');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the model has no name', () => {
      component.form.controls['name'].patchValue('');
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the model has a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name includes a /', () => {
      component.form.controls['name'].patchValue('model/name');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('submits the form with a valid model', () => {
      component.form.controls['name'].patchValue('name');
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel').and.returnValue({ subscribe: () => {} });
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).toHaveBeenCalledWith({
        cloneModel: '',
        commitMessage: 'Model Created',
        entities: {},
        name: 'name'
      });
    });
  });

  describe('error messages', () => {
    let compiled;
    beforeEach(() => {
      component.modelNames = ['model1', 'model2'];
      compiled = fixture.debugElement.nativeElement;
    });

    it('displays an error message if the name is not unique', () => {
      component.form.controls['name'].setValue('model1');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if the name includes a /', () => {
      component.form.controls['name'].setValue('new/model');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if submit button is clicked with a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      fixture.nativeElement.querySelector('#submitButton').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });
  });
});
