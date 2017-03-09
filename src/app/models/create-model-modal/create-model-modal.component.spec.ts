/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { fromJS } from 'immutable';

import { CreateModelModalComponent } from './create-model-modal.component';
import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './../../shared/form-controls-sort.pipe';
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
        FontAwesomeIconPickerComponent,
        FormControlsSortPipe ],
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
    // Needed for the icon picker.
    spyOn(document, 'querySelector').and.returnValue({
      getBoundingClientRect() {
        return {
          height: 100,
          top: 50,
        };
      }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('adding entities', () => {
    it('prevents a new entity from being added to the model if the new entity has no name', () => {
      component.form.controls['blankEntity'].patchValue({
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: ''
        });
        fixture.detectChanges();
        spyOn(component, 'addEntity');
        fixture.nativeElement.querySelector('.btn-link').click();
        expect(component.addEntity).not.toHaveBeenCalled();
    });

    it('prevents a new entity from being added to the model if the entity has no icon', () => {
      component.form.controls['blankEntity'].patchValue({
        class: '',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      fixture.detectChanges();
      spyOn(component, 'addEntity');
      fixture.nativeElement.querySelector('.btn-link').click();
      expect(component.addEntity).not.toHaveBeenCalled();
    });

    it('prevents a new entity from being added to the model if the new entity name is blank spaces', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: '  '
      });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.btn-link').click();
      expect(component.form.value.entities.length).toEqual(0);
    });

    it('adds a new entity if the new entity is valid', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.btn-link').click();
      expect(component.form.value.entities.length).toEqual(1);
    });
  });

  describe('submitting the form', () => {
    beforeEach(() => {
      component.modelNames = ['model1', 'model2'];
    });

    it('does not submit the form if the model name is not unique', () => {
      component.form.controls['name'].patchValue('model1');
      const entity = {
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const entities = component.form.controls['entities'] as FormArray;
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the model has no name', () => {
      component.form.controls['name'].patchValue('');
      const entity = {
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const entities = component.form.controls['entities'] as FormArray;
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the model has a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      const entity = {
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const entities = component.form.controls['entities'] as FormArray;
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if the model has no entities', () => {
      component.form.controls['name'].patchValue('name');
      component.form.controls['entities'].patchValue([]);
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if any entities have no names', () => {
      component.form.controls['name'].patchValue('name');
      const entity = {
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: ''
      };
      const entities = component.form.controls['entities'] as FormArray;
      entities.insert(0, component.createEntity(fromJS(entity)));
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('does not submit the form if any entities have names of blank spaces', () => {
      component.form.controls['name'].patchValue('name');
      const entity = {
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: '  '
      };
      const entities = component.form.controls['entities'] as FormArray;
      entities.insert(0, component.createEntity(fromJS(entity)));
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel');
      fixture.nativeElement.querySelector('button.button').click();
      expect(component.stateService.model.addModel).not.toHaveBeenCalled();
    });

    it('submits the form with a valid model', () => {
      component.form.controls['name'].patchValue('name');
      const entity = {
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const entities = component.form.controls['entities'] as FormArray;
      entities.insert(0, component.createEntity(fromJS(entity)));
      fixture.detectChanges();
      spyOn(component.stateService.model, 'addModel').and.returnValue({ subscribe: () => {} });
      fixture.nativeElement.querySelectorAll('button.button')[3].click();
      expect(component.stateService.model.addModel).toHaveBeenCalledWith({
        cloneModel: '',
        commitMessage: 'Model Created',
        entities: {
          something: {
            class: 'music',
            color: '#00FF00',
            image: '\uf001',
            size: '10',
            type: 'something'
          }
        },
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

    it('displays an error message if submit button is clicked with a name of blank spaces', () => {
      component.form.controls['name'].patchValue('  ');
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if submit button is clicked with no entities added', () => {
      component.form.controls['name'].patchValue('name');
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if the new entity name is blank', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: ''
      });
      const blankEntityForm = component.form.controls['blankEntity'] as FormGroup;
      blankEntityForm.controls['type'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error messages if any entities have blank names', () => {
      component.form.controls['name'].patchValue('name');
      const entity = {
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: ''
      };
      const entities = component.form.controls['entities'] as FormArray;
      entities.insert(0, component.createEntity(fromJS(entity)));
      const entitiesForm = entities.controls[0] as FormGroup;
      entitiesForm.controls['type'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });

    it('displays an error message if submit button is clicked with an entity that has a name of blank spaces', () => {
      component.form.controls['name'].patchValue('name');
      const entity = {
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: '  '
      };
      const entities = component.form.controls['entities'] as FormArray;
      entities.insert(0, component.createEntity(fromJS(entity)));
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    });
  });
});
