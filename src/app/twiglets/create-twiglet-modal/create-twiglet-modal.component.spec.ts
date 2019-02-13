import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ToastrService, ToastOptions } from 'ngx-toastr';

import { CreateTwigletModalComponent } from './create-twiglet-modal.component';
import { routerForTesting } from './../../app.router';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import TWIGLET from '../../../non-angular/services-helpers/twiglet/constants';

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
        ToastrService,
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

  describe('setupTwigletaAndModelLists', () => {
    beforeEach(() => {
      const twiglets = fromJS([{ name: 'twig1'}, { name: 'twig2' }]);
      const models = fromJS([{ name: 'model1' }, { name: 'model2' }]);
      component.setupTwigletAndModelLists(twiglets, models);
    });

    it('gets the correct twiglet names', () => {
      expect(component.twigletNames).toEqual(['twig1', 'twig2']);
    });

    it('gets the correct model names', () => {
      expect(component.modelNames).toEqual(['model1', 'model2']);
    });
  });

  describe('ngAfterViewChecked', () => {
    it('does nothing if there is no form', () => {
      delete component.form;
      expect(component.ngAfterViewChecked()).toBe(false);
    });

    it('subscribes to value changes if the form exists', () => {
      spyOn(component.form.valueChanges, 'subscribe');
      component.ngAfterViewChecked();
      expect(component.form.valueChanges.subscribe).toHaveBeenCalled();
    });
  })

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

      it('does not show the json importer', () => {
        expect(compiled.querySelector('input[type=file]')).toBeFalsy();
      })
    });

    describe('not clone', () => {
      let compiled;
      beforeEach(() => {
        compiled = fixture.nativeElement;
        component.clone = Map({ name: '' });
        fixture.detectChanges();
      });

      it('has a title of "Create New Twiglet"', () => {
        expect(compiled.querySelector('.modal-title').innerHTML).toEqual('Create New Twiglet');
      });

      it('shows the model dropdown', () => {
        expect(compiled.querySelector('select[name=model]')).toBeTruthy();
      });

      it('shows the json file importer', () => {
        expect(compiled.querySelector('input[type=file]')).toBeTruthy();
      });

      it('hides the json file importer if a model has been selected', () => {
        component.form.setValue({ model: 'not N/A', description: 'whatever', name: 'whatever' });
        fixture.detectChanges();
        expect(compiled.querySelector('input[type=file]')).toBeFalsy();
      });

      it('hides the model if a file has been selected', () => {
        component.fileString = 'somefile.json';
        fixture.detectChanges();
        expect(compiled.querySelector('select[name=model]')).toBeFalsy();
      });
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

      it('closes the model if the form processes correctly', () => {
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

    describe('only runs if the form is valid', () => {
      it('does nothing if the form is invalid', () => {
        component.form.setErrors({ some: 'error' });
        expect(component.processForm()).toEqual(false);
      });

      it('does everything if the form is valid', () => {
        expect(component.processForm()).toEqual(true);
      });
    })
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

      it('alerts the user if the name includes a /', () => {
        component.form.controls['name'].setValue('na / me');
        component.form.controls['name'].markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        expect(compiled.querySelector('.alert-danger')).toBeTruthy();
      });

      it('alerts the user if the name includes a ?', () => {
        component.form.controls['name'].setValue('name?');
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

  describe('getFiles', () => {
    let reader = {
      readAsText: jasmine.createSpy('readAsText'),
      onload (e: any) { return undefined },
    }
    let event = {
      srcElement: {
        files: [
          'some file name',
        ],
      }
    }
    beforeEach(() => {
      reader = {
        readAsText: jasmine.createSpy('readAsText'),
        onload (e: any) { return undefined },
      }
      event = {
        srcElement: {
          files: [
            'some file name',
          ],
        }
      }
      window['FileReader'] = jasmine.createSpy('FileReader').and.returnValue(reader);
      spyOn(component.form.controls.model, 'updateValueAndValidity');
    });

    it('calls reader.readAsText with the correct file name', () => {
      component.getFiles(event);
      expect(reader.readAsText).toHaveBeenCalledWith(event.srcElement.files[0]);
    });

    it('updates the file string on successful file load', () => {
      component.getFiles(event);
      reader.onload({ target: { result: 'some file string' } });
      expect(component.fileString).toEqual('some file string');
    });

    it('calls updateValueAndValidity on successful file load', () => {
      component.getFiles(event);
      reader.onload({ target: { result: 'some file string' } });
      expect(component.form.controls.model.updateValueAndValidity).toHaveBeenCalled();
    });

    it('sets the file string to empty if the file load fails', () => {
      component.fileString = 'not empty';
      reader.readAsText.and.throwError('fail');
      component.getFiles(event);
      expect(component.fileString).toEqual('');
    });

    it('calls updateValueAndValidity if the file load fails', () => {
      reader.readAsText.and.throwError('fail');
      component.getFiles(event);
      expect(component.form.controls.model.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('onValueChange', () => {
    it('does nothing if there is no form', () => {
      delete component.form;
      expect(component.onValueChanged()).toBeUndefined();
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

    describe('validateSlash', () => {
      it('should return a slash failure if the name inclues a /', () => {
        const input = new FormControl('name/4');
        expect(component.validateSlash(input)).toEqual({
          slash: {
            valid: false
          }
        });
      });

      it('should return a slash failure if the name includes a ?', () => {
        const input = new FormControl('name4?');
        expect(component.validateSlash(input)).toEqual({
          slash: {
            valid: false
          }
        });
      });
    });

    describe('validateModels', () => {
      beforeEach(() => {
        component.modelNames = ['name1', 'name2', 'name3'];
      });

      it('should return null if this is a clone', () => {
        component.clone = component.clone.set(TWIGLET.NAME, 'not null');
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
