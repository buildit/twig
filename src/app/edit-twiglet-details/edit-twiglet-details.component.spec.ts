import { Map } from 'immutable';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { StateService } from './../state.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditTwigletDetailsComponent } from './edit-twiglet-details.component';
import { stateServiceStub, fullTwigletMap, twigletsList } from '../../non-angular/testHelpers';

describe('EditTwigletDetailsComponent', () => {
  let component: EditTwigletDetailsComponent;
  let fixture: ComponentFixture<EditTwigletDetailsComponent>;
  let compRef;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwigletDetailsComponent ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwigletDetailsComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: true,
    });
    component.twiglet = fullTwigletMap();
    component.twiglets = twigletsList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not display the form if the the user is editing', () => {
    component.userState = Map({
      isEditing: false,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('input')).toBeFalsy();
  });

  it('displays the form if the the user is editing', () => {
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('input')).toBeTruthy();
  });

  describe('subscriptions', () => {
    it('creates a list of twiglets', () => {
      expect(component.twigletNames).toEqual(['name1', 'name2']);
    });

    it('sets the originalTwigletName if it has not been set', () => {
      stateServiceStubbed.twiglet.loadTwiglet('id1');
      expect(component.originalTwigletName).toEqual('twiglet name');
    });

    it('does not set the originalTwigletName if it has already been set', () => {
      component.originalTwigletName = 'something else';
      stateServiceStubbed.twiglet.loadTwiglet('id1');
      expect(component.originalTwigletName).toEqual('something else');
    });

    it('patches the form values', () => {
      expect(component.form.value.description).toEqual('a description');
      expect(component.form.value.name).toEqual('twiglet name');
    });
  });

  describe('validateUniqueName', () => {
    it('passes if the name is not in twigletNames', () => {
      const c = new FormControl();
      c.setValue('name3');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('passes if the name is in twigletNames but is the original name', () => {
      component.originalTwigletName = 'name2';
      const c = new FormControl();
      c.setValue('name2');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('fails if the name is in twigletNames and is not the original', () => {
      const c = new FormControl();
      c.setValue('name2');
      expect(component.validateUniqueName(c)).toEqual({
        unique: {
          valid: false,
        }
      });
    });
  });

  describe('validate name is not just spaces', () => {
    it('passes if the name is more than just spaces', () => {
      const c = new FormControl();
      c.setValue('abc');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('fails if the name is just spaces', () => {
      const c = new FormControl();
      c.setValue('   ');
      expect(component.validateMoreThanSpaces(c)).toEqual({
        trimTest: {
          valid: false,
        }
      });
    });
  });

  describe('displays error message', () => {
    beforeEach(() => {
      stateServiceStubbed.userState.setEditing(true);
    });

    it('shows an error if the name is not unique', () => {
      component.form.controls['name'].setValue('name2');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeTruthy();
    });

    it('should error if the name is " "', () => {
      component.form.controls['name'].setValue('   ');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeTruthy();
    });

    it('shows an error if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeTruthy();
    });

    it('shows no errors if the name validates', () => {
      component.form.controls['name'].setValue('name3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeFalsy();
    });
  });
});
