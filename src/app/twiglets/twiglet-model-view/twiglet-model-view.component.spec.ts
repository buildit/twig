/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, fromJS} from 'immutable';
import { DragulaService, DragulaModule } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { fullTwigletMap, fullTwigletModelMap } from '../../../non-angular/testHelpers';
import { TwigletModelViewComponent } from './twiglet-model-view.component';
import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModelViewComponent, FontAwesomeIconPickerComponent ],
      imports: [ ReactiveFormsModule, FormsModule, NgbModule.forRoot(), DragulaModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
        DragulaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    fixture = TestBed.createComponent(TwigletModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    component.inTwiglet = [
      { inTwiglet: false, type: 'type1' },
      { inTwiglet: true, type: 'type2' },
      { inTwiglet: false, type: 'type3' },
      { inTwiglet: false, type: 'type4' },
      { inTwiglet: false, type: 'type5' },
      { inTwiglet: true, type: 'type6' }
    ];
    component.buildForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the model', () => {
    expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(6);
  });

  describe('buildForm', () => {
    it('creates a form with an entities group', () => {
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
    it('does not have a remove button for entities in the twiglet', () => {
      expect(fixture.nativeElement.querySelectorAll('.fa-minus-circle').length).toEqual(4);
    });

    it('can remove an entity not in the twiglet', () => {
      fixture.nativeElement.querySelector('.fa-minus-circle').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(5);
    });
  });

  describe('add entity', () => {
    it('responds to a new entity', () => {
      component.form.controls['blankEntity'].patchValue({
        attributes: [],
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      component.addEntity();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(7);
    });

    it('does not add an entity with no name', () => {
      component.form.controls['blankEntity'].patchValue({
        attributes: [],
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: ''
      });
      component.addEntity();
      fixture.detectChanges();
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

  describe('error messages', () => {
    it('does not start out showing any form errors', () => {
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeFalsy();
    });

    it('shows an error message if the blank entity has no type', () => {
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
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
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
      component.twigletModel = fullTwigletModelMap();
      fixture.detectChanges();
      component.expanded[0] = true;
      component.addAttribute(0);
    });

    it('add attribute button builds an attribute form', () => {
      expect((component.form.controls['entities']['controls'][0].controls.attributes as FormArray).length).toEqual(3);
    });

    it('shows an error if the attribute name is blank', () => {
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['name'].setValue('');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('does not show an error if an attribute name and data type are filled out', () => {
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['name'].setValue('attr1');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['name'].markAsDirty();
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['dataType'].setValue('string');
      component.form.controls['entities']['controls'][0].controls.attributes.controls[2].controls['dataType'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeFalsy();
    });

    it('remove attribute removes the attribute', () => {
      component.removeAttribute(0, 0);
      expect((component.form.controls['entities']['controls'][0].controls.attributes as FormArray).length).toEqual(2);
    });
  });
});
