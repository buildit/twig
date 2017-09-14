/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { CreateModelModalComponent } from './create-model-modal.component';
import { StateService } from './../../state.service';
import { mockToastr, stateServiceStub } from '../../../non-angular/testHelpers';

describe('CreateModelModalComponent', () => {
  let component: CreateModelModalComponent;
  let fixture: ComponentFixture<CreateModelModalComponent>;
  let stateServiceStubbed: StateService;
  let toastr = mockToastr();
  let router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    toastr = mockToastr();
    router = { navigate: jasmine.createSpy('navigate') };
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        CreateModelModalComponent,
      ],
      imports: [
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ToastsManager, useValue: toastr },
        NgbActiveModal,
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

  describe('setupModelList', () => {
    it('can create a list of model names', () => {
      component.setupModelLists(List([{ name: 'name1'}, { name: 'name2' }]));
      expect(component.modelNames).toEqual(['name1', 'name2']);
    });
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

    it('does not submit the form if the name includes a ?', () => {
      component.form.controls['name'].patchValue('modelname?');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('#submitButton').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    })

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

    it('displays an error message if the name includes a ?', () => {
      component.form.controls['name'].setValue('newmodel?');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });
  });

  describe('onValueChange()', () => {
    it('does nothing if there is no form', () => {
      component.form = null;
      expect(component.onValueChanged()).toBeUndefined();
    });
  });

  describe('processForm()', () => {
    beforeEach(() => {
      spyOn(stateServiceStubbed.model, 'addModel').and.returnValue(Observable.of({ name: 'some name' }));
      spyOn(stateServiceStubbed.model, 'updateListOfModels');
      component.form.patchValue({ name: 'some name' });
      spyOn(component.activeModal, 'close');
      component.processForm();
    });

    it('updates the list of models', () => {
      expect(stateServiceStubbed.model.updateListOfModels).toHaveBeenCalled();
    });

    it('closes the modal', () => {
      expect(component.activeModal.close).toHaveBeenCalled();
    });

    it('navigates to the new model', () => {
      expect(router.navigate).toHaveBeenCalledWith(['model', 'some name']);
    });

    it('toasts success', () => {
      expect(toastr.success).toHaveBeenCalled();
    });
  });

  describe('handling errors', () => {
    beforeEach(() => {
      spyOn(console, 'error');
    });

    it('sends the error to the user', () => {
      component.handleError(new Error('an error message'));
      expect(console.error).toHaveBeenCalled();
    });

    it('toasts an error', () => {
      component.handleError(new Error('an error message'));
      expect(toastr.error).toHaveBeenCalled();
    });

    it('shows the api error if it exists', () => {
      const error = new Error('an error message');
      error['_body'] = JSON.stringify({ message: 'an api message' });
      component.handleError(error);
      expect(toastr.error).toHaveBeenCalledWith('an api message', 'Server Error');
    });
  });
});
