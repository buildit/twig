import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';

import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';
import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './../../shared/pipes/form-controls-sort.pipe';
import { fullModelMap } from '../../../non-angular/testHelpers';
import { HeaderModelComponent } from './../header-model/header-model.component';
import { ModelDropdownComponent } from './../model-dropdown/model-dropdown.component';
import { ModelFormComponent } from './model-form.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import { DismissibleHelpModule } from '../../directives/dismissible-help/dismissible-help.module';

const fakeRouter = {
  navigate: jasmine.createSpy('navigate'),
};

describe('ModelFormComponent', () => {
  let component: ModelFormComponent;
  let fixture: ComponentFixture<ModelFormComponent>;
  let stateServiceStubbed: StateService;
  let fakeModalObservable;
  let closeModal;

  beforeEach(async(() => {
    closeModal = jasmine.createSpy('closeModal');
    stateServiceStubbed = stateServiceStub();
    stateServiceStubbed.userState.setEditing(true);
    fakeModalObservable = new ReplaySubject();
    TestBed.configureTestingModule({
      declarations: [
        DismissibleHelpDialogComponent,
        FontAwesomeIconPickerComponent ,
        FormControlsSortPipe,
        HeaderModelComponent,
        ModelFormComponent,
        ModelDropdownComponent,
      ],
      imports: [
        DismissibleHelpModule.forRoot(),
        DragulaModule,
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: fakeRouter },
        DragulaService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormComponent);
    component = fixture.componentInstance;
    component.USERSTATE = USERSTATE_CONSTANTS;
    component.userState = Map({
      formValid: true,
      isEditing: true,
      mode: 'model',
      user: 'user'
    });
    component.models = fromJS([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildForm', () => {
    it('creates a form with an entities group', () => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.form = null;
      component.buildForm();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });
  });

  describe('onValueChanges', () => {
    it('does nothing if there is no form', () => {
      component.form = null;
      spyOn(component, 'checkEntitiesAndMarkErrors');
      component.onValueChanged();
      expect(component.checkEntitiesAndMarkErrors).not.toHaveBeenCalled();
    });
  });

  describe('createAttribute', () => {
    it('can create from an existing attribute object', () => {
      expect(component.createAttribute({ dataType: 'string', required: true }).value.required).toBe(true);
    });

    it('can create a new attribute', () => {
      expect(component.createAttribute().value.required).toBe(false);
    });

    it('can create from an existing attribute map', () => {
      expect(component.createAttribute(fromJS({ dataType: 'string', required: true })).value.required).toBe(true);
    });
  });

  describe('createEntity', () => {
    it('creates an empty entity if nothing is passed in', () => {
      const control = component.createEntity();
      expect(control.value).toEqual({
        attributes: [],
        class: '',
        color: '#000000',
        image: '',
        type: ''
      });
    });

    it('uses the values passed in to create a non-empty entity', () => {
      const entity = {
        attributes: [],
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        type: 'something'
      };
      const control = component.createEntity(fromJS(entity));
      expect(control.value).toEqual(entity);
    });
  });

  describe('remove entity', () => {
    beforeEach(() => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
    });

    it('can remove an entity at an index', () => {
      component.removeEntity(1, component.form.controls['entities']['controls'][1]['controls']['type']);
      expect((component.form.controls['entities']['controls'].every(group => group.controls.type !== 'ent2'))).toBeTruthy();
    });

    it('sets the form to valid if there are no validation errors', () => {
      component.validationErrors = Map({});
      spyOn(stateServiceStubbed.userState, 'setFormValid');
      component.removeEntity(1, component.form.controls['entities']['controls'][1]['controls']['type']);
      expect(stateServiceStubbed.userState.setFormValid).toHaveBeenCalled();
    });

    it('does not set the form to valid if the are validation errors', () => {
      component.validationErrors = Map({ an: 'error' });
      spyOn(stateServiceStubbed.userState, 'setFormValid');
      component.removeEntity(1, component.form.controls['entities']['controls'][1]['controls']['type']);
      expect(stateServiceStubbed.userState.setFormValid).not.toHaveBeenCalled();
    });
  });

  describe('add entity', () => {
    beforeEach(() => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
    });

    it('can add an entity', () => {
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(7);
    });
  });

  describe('error messages', () => {
    beforeEach(() => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
    });

    it('does not start out showing any form errors', () => {
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeFalsy();
    });

    it('shows an error if an entity has no type', () => {
      component.form.controls['entities']['controls'][0].controls.type.patchValue('');
      component.form.controls['entities']['controls'][0].controls.type.markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });
  });

  describe('attributes', () => {
    beforeEach(() => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
      component.expanded[0] = true;
      component.addAttribute(0);
    });

    it('add attribute button builds an attribute form', () => {
      expect((component.form.controls['entities']['controls'][0].controls.attributes as FormArray).length).toEqual(3);
    });

    it('shows an error if the attribute name is blank', () => {
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['name'].setValue('');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('does not show an error if an attribute name and data type are filled out', () => {
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['name'].setValue('attr1');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['name'].markAsDirty();
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['dataType'].setValue('string');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[0].controls['dataType'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeFalsy();
    });

    it('remove attribute removes the attribute', () => {
      component.removeAttribute(0, 0);
      expect((component.form.controls['entities']['controls'][0].controls.attributes as FormArray).length).toEqual(2);
    });
  });

  describe('stopEditing', () => {
    it('sets userstate Editing to false', () => {
      component.discardChanges();
      stateServiceStubbed.userState.observable.first().subscribe((userState) => {
        expect(userState.get(component.USERSTATE.IS_EDITING)).toBeFalsy();
      });
    });
  });

  describe('saveModel', () => {
    beforeEach(() => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: {
          closeModal,
          observable: fakeModalObservable.asObservable()
        }
      });
    });

    it('opens the model', () => {
      component.saveModel();
      expect(component.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
    });

    describe('form results', () => {
      const bs = new BehaviorSubject({});
      beforeEach(() => {
        spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue(bs.asObservable());
        spyOn(stateServiceStubbed.userState, 'startSpinner');
        spyOn(stateServiceStubbed.userState, 'stopSpinner');
        component.saveModel();
      });

      it('starts the spinner when the user responds to the form', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.startSpinner).toHaveBeenCalled();
      });

      it('saves the changes with the correct commit message', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.model.saveChanges).toHaveBeenCalledWith('a commit message');
      });

      it('stops editing mode if the user is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get(component.USERSTATE.IS_EDITING)).toBeFalsy();
        });
      });

      it('continues editing mode if the user chooses to', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get(component.USERSTATE.IS_EDITING)).toBeTruthy();
        });
      });

      it('closes the modal', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(closeModal).toHaveBeenCalled();
      });

      it('stops the spinner when everything is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.stopSpinner).toHaveBeenCalled();
      });
    });
  });

  describe('toggleAttributes', () => {
    it('starts the expansion map as true', () => {
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeTruthy();
    });

    it('can switch an expanded node to false', () => {
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeFalsy();
    });

    it('can switch an unexpanded node to true', () => {
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeTruthy();
    });
  });
});
