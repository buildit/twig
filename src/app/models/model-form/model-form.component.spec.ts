import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './../../shared/form-controls-sort.pipe';
import { ModelFormComponent } from './model-form.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('ModelFormComponent', () => {
  let component: ModelFormComponent;
  let fixture: ComponentFixture<ModelFormComponent>;
  let stateServiceStubbed: StateService;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        FontAwesomeIconPickerComponent ,
        FormControlsSortPipe,
        ModelFormComponent,
      ],
      imports: [
        DragulaModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot(),
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        DragulaService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads the model', () => {
      stateServiceStubbed.model.loadModel('bsc');
      component.buildForm();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(11);
    });

    it('loads the miniModel', () => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(6);
    });

    describe('Adding an entity', () => {
      it('responds to new entities', () => {
        stateServiceStubbed.model.loadModel('miniModel');
        component.buildForm();
        component.form.controls['blankEntity'].patchValue({
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: 'something'
        });
        component.addEntity();
        expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(7);
      });
    });
  });

  describe('buildForm', () => {
    it('creates a form with an entities group', () => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.form = null;
      component.buildForm();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
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
        size: '',
        type: ''
      });
    });

    it('uses the values passed in to create a non-empty entity', () => {
      const entity = {
        attributes: [],
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const control = component.createEntity(fromJS(entity));
      expect(control.value).toEqual(entity);
    });
  });

  describe('remove entity', () => {
    it('can remove an entity at an index', () => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.removeEntity(1);
      expect((component.form.controls['entities'] as FormArray)['ent2']).toBeFalsy();
    });
  });

  describe('add entity', () => {
    beforeEach(() => {
      stateServiceStubbed.model.loadModel('miniModel');
      component.buildForm();
    });

    it('can add an entity', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(7);
    });

    it('does not add an entity with no name', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: ''
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });

    it('does not add an entity with a name of blank spaces', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: '  '
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });

    it('does not add an entity with no icon', () => {
      component.form.controls['blankEntity'].patchValue({
        class: '',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });
  });
});
