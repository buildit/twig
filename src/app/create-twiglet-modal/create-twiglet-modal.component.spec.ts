import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { routerForTesting } from './../app.router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { CreateTwigletModalComponent } from './create-twiglet-modal.component';

describe('CreateTwigletModalComponent', () => {
  let component: CreateTwigletModalComponent;
  let fixture: ComponentFixture<CreateTwigletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTwigletModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        { provide: StateService, useValue: stateServiceStub()},
        NgbActiveModal,
        FormBuilder,
        ToastsManager,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTwigletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('processForm', () => {
    beforeEach(() => {
      spyOn(component.stateService.backendService, 'updateListOfTwiglets');
      spyOn(component.activeModal, 'close');
      spyOn(component.toastr, 'error');
      spyOn(component.toastr, 'success');
      component.twigletNames = ['name1'];
      component.form.controls['name'].setValue('name2');
      component.form.controls['name'].markAsDirty();
      component.modelIds = ['model1'];
      component.form.controls['model'].setValue('model1');
      component.form.controls['model'].markAsDirty();
    });

    describe('success', () => {
      beforeEach(() => {
        component.processForm();
      });

      it('updates the list of twiglets', () => {
        expect(component.stateService.backendService.updateListOfTwiglets).toHaveBeenCalled();
      });

      it('closes the model if the form processes correclty', () => {
        expect(component.activeModal.close).toHaveBeenCalled();
      });

      it('closes reroutes to the correct page', () => {
        expect(component.router.navigate).toHaveBeenCalled();
      });

      it('displays a success message', () => {
        expect(component.toastr.success).toHaveBeenCalled();
      });
    });

    describe('errors', () => {
      beforeEach(() => {
        spyOn(component.stateService.twiglet, 'addTwiglet').and.returnValue(Observable.throw({statusText: 'whatever'}));
        component.processForm();
      });

      it('does not close the modal', () => {
        expect(component.activeModal.close).not.toHaveBeenCalled();
      });

      it('displays an error message', () => {
        expect(component.toastr.error).toHaveBeenCalled();
      });
    });
  });

  describe('displays error messages', () => {
    let compiled;
    describe('name errors', () => {
      beforeEach(() => {
        component.twigletNames = ['name1', 'name2', 'name3'];
        compiled = fixture.debugElement.nativeElement;
      });

      it('alerts the user when the name is already taken', () => {
        component.form.controls['name'].setValue('name1');
        component.form.controls['name'].markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        expect(compiled.querySelector('.alert-danger')).toBeTruthy();
      });

      it('alerts the user is blank', () => {
        component.form.controls['name'].setValue('');
        component.form.controls['name'].markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        expect(compiled.querySelector('.alert-danger')).toBeTruthy();
      });

      it('No errors show up when the name is unique and filled in', () => {
        component.form.controls['name'].setValue('name4');
        component.form.controls['name'].markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        expect(compiled.querySelector('.alert-danger')).toBeFalsy();
      });
    });
  });

  describe('validators', () => {
    describe('validateName', () => {
      beforeEach(() => {
        component.twigletNames = ['name1', 'name2', 'name3'];
      });

      it('should return null if the name is not taken', () => {
        const input = {
          value: 'name4',
        } as any as FormControl;
        expect(component.validateName(input)).toEqual(null);
      });

      it('should return a unique failure if the name is taken', () => {
        const input = {
          value: 'name1',
        } as any as FormControl;
        expect(component.validateName(input)).toEqual({
          unique: {
            valid: false,
          },
        });
      });
    });
  });
});
