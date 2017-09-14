import { DebugElement, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map, List } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { fullModelMap, modelsList, stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { RenameModelModalComponent } from './rename-model-modal.component';
import { StateService } from './../../state.service';

describe('RenameModelModalComponent', () => {
  let component: RenameModelModalComponent;
  let fixture: ComponentFixture<RenameModelModalComponent>;
  let stateServiceStubbed = stateServiceStub();
  let toastr = mockToastr();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    toastr = mockToastr();
    TestBed.configureTestingModule({
      declarations: [ RenameModelModalComponent ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        NgbActiveModal,
        { provide: ToastsManager, useValue: toastr }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameModelModalComponent);
    component = fixture.componentInstance;
    component.modelNames = ['name1', 'name2'];
    component.modelName = 'bsc';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateUniqueName', () => {
    it('passes if the name is not in modelNames', () => {
      const c = new FormControl();
      c.setValue('name3');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('passes if the name is in modelNames but is the original name', () => {
      component.modelName = 'name2';
      const c = new FormControl();
      c.setValue('name2');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('fails if the name is in modelNames and is not the original', () => {
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
  });

  describe('validateSlash', () => {
    it('fails if the name includes a /', () => {
      const c = new FormControl();
      c.setValue('name/3');
      expect(component.validateSlash(c)).toEqual({
        slash: {
          valid: false
        }
      });
    });

    it('fails if the name includes a ?', () => {
      const c = new FormControl();
      c.setValue('name?');
      expect(component.validateSlash(c)).toEqual({
        slash: {
          valid: false
        }
      });
    });
  });

  describe('displays error message', () => {
    it('shows an error if the name is not unique', () => {
      component.form.controls['name'].setValue('name2');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name includes a /', () => {
      component.form.controls['name'].setValue('name/3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name includes a ?', () => {
      component.form.controls['name'].setValue('name3?');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows no errors if the name validates', () => {
      component.form.controls['name'].setValue('name3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeFalsy();
    });
  });

  describe('setupModelList', () => {
    it('can create a list of model names', () => {
      component.setupModelLists(List([{ name: 'name1'}, { name: 'name2' }]));
      expect(component.modelNames).toEqual(['name1', 'name2']);
    });
  });

  describe('onValueChange', () => {
    it('does nothing if there is no form', () => {
      component.form = null;
      expect(component.onValueChanged()).toBeUndefined();
    });
  });

  describe('process form', () => {

    it('displays a toastr warning if nothing on the form changes', () => {
      fixture.nativeElement.querySelector('.submit').click();
      expect(toastr.warning).toHaveBeenCalled();
    });

    it('does not submit the form if the name is empty', () => {
      component.form.controls['name'].patchValue('');
      fixture.detectChanges();
      spyOn(stateServiceStubbed.model, 'setName');
      fixture.nativeElement.querySelector('.submit').click();
      expect(stateServiceStubbed.model.setName).not.toHaveBeenCalled();
    });

    it('saves the changes when the form has a new name', () => {
      component.form.controls['name'].patchValue('new name');
      component.form.controls['name'].markAsDirty();
      fixture.detectChanges();
      spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue({ subscribe: () => {} });
      fixture.nativeElement.querySelector('.submit').click();
      expect(stateServiceStubbed.model.saveChanges).toHaveBeenCalledWith('"bsc" renamed to "new name"');
    });

    describe('success', () => {
      beforeEach(() => {
        component.form.controls['name'].patchValue('new name');
        component.form.controls['name'].markAsDirty();
        fixture.detectChanges();
        spyOn(stateServiceStubbed.model, 'updateListOfModels');
        spyOn(component.activeModal, 'close');
        spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue(Observable.of({}));
        component.processForm();
      });

      it('updates the list of models', () => {
        expect(stateServiceStubbed.model.updateListOfModels).toHaveBeenCalled();
      });

      it('closes the modal if the form processes correctly', () => {
        expect(component.activeModal.close).toHaveBeenCalled();
      });

      it('closes reroutes to the correct page', () => {
        expect(component.router.navigate).toHaveBeenCalled();
      });
    });
  });
});
