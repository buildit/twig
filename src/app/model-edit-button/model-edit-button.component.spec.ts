/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map } from 'immutable';

import { ModelEditButtonComponent } from './model-edit-button.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { FormControlsSortPipe } from './../form-controls-sort.pipe';

describe('ModelEditButtonComponent', () => {
  let component: ModelEditButtonComponent;
  let fixture: ComponentFixture<ModelEditButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelEditButtonComponent ],
      providers: [
        ToastsManager,
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelEditButtonComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      formValid: false,
      isEditing: true,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the edit button when user is not editing', () => {
    component.userState = Map({
      isEditing: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeTruthy();
  });

  it('should not display the edit button when user is editing', () => {
    expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeFalsy();
  });

  it('should display the save button when user is editing', () => {
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
  });

  it('should display the discard button when the user is editing', () => {
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
  });

  it('should not display save button if user is not editing', () => {
    component.userState = Map({
      isEditing: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
  });

  it('should not display discard button if user is not editing', () => {
    component.userState = Map({
      isEditing: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
  });

  it('should set the user state to editing when the edit button is clicked', () => {
    component.userState = Map({
      isEditing: false,
    });
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setEditing');
    fixture.nativeElement.querySelector('.fa-pencil').click();
    expect(stateServiceStubbed.userState.setEditing).toHaveBeenCalledWith(true);
  });

  it('should load the current model when discard is clicked', () => {
    stateServiceStubbed.model.loadModel('bsc');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.model, 'restoreBackup');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.model.restoreBackup).toHaveBeenCalled();
  });

  it('save button is disabled when form is invalid', () => {
    spyOn(component, 'saveModel');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveModel).not.toHaveBeenCalled();
  });

  it('save button is not disabled when form is valid', () => {
    component.userState = Map({
      formValid: true,
      isEditing: true,
    });
    fixture.detectChanges();
    spyOn(component, 'saveModel');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveModel).toHaveBeenCalled();
  });
});
