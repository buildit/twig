import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { CreateTwigletModalComponent } from './create-twiglet-modal.component';
import { routerForTesting } from './../../app.router';

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
        ToastOptions,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTwigletModalComponent);
    component = fixture.componentInstance;
    component.clone = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    describe('clone', () => {
      let compiled;
      beforeEach(() => {
        component.clone = Map({
          name: 'some name'
        });
        component.buildForm();
        fixture.detectChanges();
        compiled = fixture.nativeElement;
      });

      it('has a title of "Clone <NAME>"', () => {
        expect(compiled.querySelector('.modal-title').innerHTML).toEqual('Clone some name');
      });

      it('does not show the model dropdown', () => {
        expect(compiled.querySelector('select[name=model]')).toBeFalsy();
      });

      it('does not show the clone dropdown', () => {
        expect(compiled.querySelector('select[name=cloneTwiglet]')).toBeFalsy();
      });

      it('does not show the Google Sheets dropdown', () => {
        expect(compiled.querySelector('input[name=googlesheet]')).toBeFalsy();
      });
    });

    describe('not clone', () => {
      let compiled;
      beforeEach(() => {
        compiled = fixture.nativeElement;
        component.clone = Map({});
        fixture.detectChanges();
      });

      it('has a title of "Create New Twiglet"', () => {
        expect(compiled.querySelector('.modal-title').innerHTML).toEqual('Create New Twiglet');
      });

      it('shows the model dropdown', () => {
        expect(compiled.querySelector('select[name=model]')).toBeTruthy();
      });

      it('shows the clone dropdown', () => {
        expect(compiled.querySelector('select[name=cloneTwiglet]')).toBeTruthy();
      });

      it('shows the Google Sheets dropdown', () => {
        expect(compiled.querySelector('input[name=googlesheet]')).toBeTruthy();
      });
    });

    it('does not show the clone twiglet dropdown if the google sheet is filled in', () => {
      component.form.controls['googlesheet'].setValue('something');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('select[name=cloneTwiglet]')).toBeFalsy();
    });
  });

  describe('buildForm', () => {
    it('sets the name to "<NAME> - copy" if a clone', () => {
      component.clone = Map({
        name: 'some name',
      });
      component.buildForm();
      expect(component.form.value.name).toEqual('some name - copy');
    });

    it('the name is blank if a clone', () => {
      component.buildForm();
      expect(component.form.value.name).toEqual('');
    });

    it('removes all validators from the model if cloneTwiglet has a value', () => {
      component.form.controls['cloneTwiglet'].setValue('name1');
      component.form.controls['model'].markAsDirty();
      expect(component.form.controls['model'].invalid).toBeFalsy();
    });

    it('adds validation to the model if the cloneTwiglet has no value', () => {
      component.form.controls['cloneTwiglet'].setValue('');
      component.form.controls['model'].markAsDirty();
      expect(component.form.controls['model'].invalid).toBeTruthy();
    });
  });

  describe('processForm', () => {
    beforeEach(() => {
      spyOn(component.stateService.twiglet, 'updateListOfTwiglets');
      spyOn(component.activeModal, 'close');
      spyOn(component.toastr, 'error');
      spyOn(component.toastr, 'success');
      component.twigletNames = ['name1'];
      component.form.controls['name'].setValue('name2');
      component.form.controls['name'].markAsDirty();
      component.modelNames = ['model1'];
      component.form.controls['model'].setValue('model1');
      component.form.controls['model'].markAsDirty();
    });

    describe('commit messages', () => {
      it('uses: "Cloned <NAME>" when a clone', () => {
        component.clone = Map({
          name: 'some name',
        });
        component.processForm();
        expect(component.form.value.commitMessage).toEqual('Cloned some name');
      });

      it('uses: "Twiglet Created" when not a clone', () => {
        component.clone = Map({
          name: '',
        });
        component.processForm();
        expect(component.form.value.commitMessage).toEqual('Twiglet Created');
      });
    });


    describe('success', () => {
      beforeEach(() => {
        component.processForm();
      });

      it('updates the list of twiglets', () => {
        expect(component.stateService.twiglet.updateListOfTwiglets).toHaveBeenCalled();
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
        spyOn(console, 'error');
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

      it('alerts the user if the name is blank', () => {
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
        const input = new FormControl('name4');
        expect(component.validateName(input)).toEqual(null);
      });

      it('should return a unique failure if the name is taken', () => {
        const input = new FormControl('name1');
        expect(component.validateName(input)).toEqual({
          unique: {
            valid: false,
          },
        });
      });
    });

    describe('validateModels', () => {
      beforeEach(() => {
        component.modelNames = ['name1', 'name2', 'name3'];
      });

      it('should return null if this is a clone', () => {
        component.clone = component.clone.set('name', 'not null');
        const input = new FormControl('N/A');
        expect(component.validateModels(input)).toEqual(null);
      });

      it('should return null if the model name is valid', () => {
        const input = new FormControl('name1');
        expect(component.validateModels(input)).toEqual(null);
      });

      it('should return a required failure if the name is taken', () => {
        const input = new FormControl('name4');
        expect(component.validateModels(input)).toEqual({
          required: {
            valid: false,
          },
        });
      });
    });
  });
});
