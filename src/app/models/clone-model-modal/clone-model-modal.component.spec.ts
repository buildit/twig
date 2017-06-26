/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Map } from 'immutable';

import { CloneModelModalComponent } from './clone-model-modal.component';
import { routerForTesting } from './../../app.router';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('CloneModelModalComponent', () => {
  let component: CloneModelModalComponent;
  let fixture: ComponentFixture<CloneModelModalComponent>;
  let stateServiceStubbed: StateService;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ CloneModelModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        { provide: StateService, useValue: stateServiceStubbed },
        FormBuilder,
        NgbActiveModal,
        ToastsManager,
        ToastOptions,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneModelModalComponent);
    component = fixture.componentInstance;
    component.model = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    let compiled;
    beforeEach(() => {
      component.modelName = 'some name';
      component.buildForm();
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('has a title of "Clone <NAME>"', () => {
      expect(compiled.querySelector('.modal-title').innerHTML).toEqual('Clone some name');
    });
  });

  describe('build form', () => {
    it('sets the name to "<NAME> - clone"', () => {
      component.modelName = 'some name';
      component.buildForm();
      expect(component.form.value.name).toEqual('some name - clone');
    });
  });

  describe('process form', () => {
    beforeEach(() => {
      spyOn(component.stateService.model, 'updateListOfModels');
      spyOn(component.activeModal, 'close');
      spyOn(component.toastr, 'error');
      spyOn(component.toastr, 'success');
      component.modelNames = ['model1', 'model2'];
    });

    it('submits the correct model with commit message', () => {
      component.modelName = 'some name';
      component.buildForm();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel').and.returnValue({ subscribe: () => {} });
      component.processForm();
      expect(component.stateService.model.addModel).toHaveBeenCalledWith({
        cloneModel: 'some name',
        commitMessage: 'some name - clone created',
        entities: {},
        name: 'some name - clone'
      });
    });

    it('does not submit the form if the name is empty', () => {
      component.form.controls['name'].patchValue('');
      component.form.controls['name'].markAsDirty();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('.btn-primary').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it ('does not submit the form if the name is blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      component.form.controls['name'].markAsDirty();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('.btn-primary').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name is not unique', () => {
      component.form.controls['name'].patchValue('model1');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('.btn-primary').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name includes a /', () => {
      component.form.controls['name'].patchValue('model1/clone');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('.btn-primary').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
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
      component.form.controls['name'].setValue('model/clone');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if submit button is clicked with a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      fixture.nativeElement.querySelector('.btn-primary').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });
  });
});
