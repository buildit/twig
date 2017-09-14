import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';
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
import { mockToastr, stateServiceStub } from '../../../non-angular/testHelpers';

describe('CloneModelModalComponent', () => {
  let component: CloneModelModalComponent;
  let fixture: ComponentFixture<CloneModelModalComponent>;
  let stateServiceStubbed: StateService;
  let router = { navigate: jasmine.createSpy('navigate') };
  let toastr = mockToastr();

  beforeEach(async(() => {
    toastr = mockToastr();
    router = { navigate: jasmine.createSpy('navigate') };
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ CloneModelModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: Router, useValue: router },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ToastsManager, useValue: toastr },
        FormBuilder,
        NgbActiveModal,
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

  describe('setupModelList', () => {
    it('can create a list of model names', () => {
      component.setupModelLists(List([{ name: 'name1'}, { name: 'name2' }]));
      expect(component.modelNames).toEqual(['name1', 'name2']);
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
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it ('does not submit the form if the name is blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      component.form.controls['name'].markAsDirty();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name is not unique', () => {
      component.form.controls['name'].patchValue('model1');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name includes a /', () => {
      component.form.controls['name'].patchValue('model1/clone');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the name includes a ?', () => {
      component.form.controls['name'].patchValue('model1?');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    })
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

    it('displays an error message if the name includes a ?', () => {
      component.form.controls['name'].setValue('model?clone');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    })

    it('displays an error message if submit button is clicked with a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      fixture.nativeElement.querySelectorAll('button.button')[1].click();
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
