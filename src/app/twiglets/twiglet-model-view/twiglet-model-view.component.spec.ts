/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, fromJS} from 'immutable';
import { DragulaService, DragulaModule } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { fullTwigletMap, fullTwigletModelMap } from '../../../non-angular/testHelpers';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletModelViewComponent } from './twiglet-model-view.component';

describe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    stateServiceStubbed.twiglet.createBackup();
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        FontAwesomeIconPickerComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
        TwigletModelViewComponent,
      ],
      imports: [
        DragulaModule,
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
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
    it('does not have a remove button for entities in the twiglet', () => {
      expect(fixture.nativeElement.querySelectorAll('.fa-trash').length).toEqual(4);
    });

    it('can remove an entity not in the twiglet', () => {
      fixture.nativeElement.querySelector('.fa-trash').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(5);
    });
  });

  describe('add entity', () => {
    it('responds to a new entity', () => {
      component.addEntity();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(7);
    });
  });

  describe('error messages', () => {
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

    describe('attributes are hidden until shown', () => {
      beforeEach(() => {
        component.addAttribute(0);
        component.addAttribute(1);
      });

      it('says "Hide Attributes" if they are displayed', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.entity-row')[0].querySelector('.toggle-attributes').innerText)
          .toEqual('Hide Attributes');
      });

      it('says "Show Attributes" if they are hidden', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.entity-row')[1].querySelector('.toggle-attributes').innerText)
          .toEqual('Show Attributes');
      });

      it('shows the attributes', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.entity-row')[0].querySelector('.attribute')).toBeTruthy();
      });

      it('hides attributes that have not been expanded', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.entity-row')[1].querySelector('.attribute')).toBeFalsy();
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
