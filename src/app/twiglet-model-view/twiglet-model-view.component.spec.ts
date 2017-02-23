/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { Map, fromJS} from 'immutable';

import { TwigletModelViewComponent } from './twiglet-model-view.component';
import { FontAwesomeIconPickerComponent } from './../font-awesome-icon-picker/font-awesome-icon-picker.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModelViewComponent, FontAwesomeIconPickerComponent ],
      imports: [ ReactiveFormsModule, FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: Observable.of({id: 'id1'}) } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads the twiglet model', () => {
      expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(9);
    });
  });

  describe('adding an entity', () => {
    it('responds to new entities', () => {
      component.form.controls['blankEntity'].setValue({
          class: 'music',
          color: '#00FF00',
          image: '\uf001',
          size: '10',
          type: 'something'
      });
      component.addEntity();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(10);
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

  describe('build form', () => {
    it('creates a form with an entities group', () => {
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });
  });

  describe('createEntity', () => {
    it('creates an empty entity if nothing is passed in', () => {
      const control = component.createEntity();
      expect(control.value).toEqual({
        class: '',
        color: '#000000',
        image: '',
        size: '',
        type: ''
      });
    });

    it('uses the values passed in to create a non-empty entity', () => {
      const entity = {
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

  describe('removeEntity', () => {
    it('can remove an entity at a certain index', () => {
      component.removeEntity(4);
      expect((component.form.controls['entities'] as FormArray)['ent4ext']).toBeFalsy();
    });
  });
});
