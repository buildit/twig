import { DebugElement, ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ViewsSaveModalComponent } from './views-save-modal.component';

describe('ViewsSaveModalComponent', () => {
  let component: ViewsSaveModalComponent;
  let fixture: ComponentFixture<ViewsSaveModalComponent>;
  let stateService;

  beforeEach(async(() => {
    stateService = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ViewsSaveModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [
        NgbActiveModal,
        ToastsManager,
        ToastOptions,
        { provide: StateService, useValue: stateService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ],
    })
    .overrideComponent(ViewsSaveModalComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsSaveModalComponent);
    component = fixture.componentInstance;
    component.views = fromJS([{ name: 'name1' }, { name: 'name2' }]);
    component.viewNames = ['name1', 'name2'];
    component.twigletName = 'twigletName';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateUniqueName', () => {
    it('passes if the name is not in viewNames', () => {
      const c = new FormControl();
      c.setValue('name3');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('passes if the name is in viewNames but is the original name', () => {
      component.name = 'name2';
      const c = new FormControl();
      c.setValue('name2');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('fails if the name is in viewNames and is not the original', () => {
      const c = new FormControl();
      c.setValue('name2');
      expect(component.validateUniqueName(c)).toEqual({
        unique: {
          valid: false,
        }
      });
    });
  });

  describe('validateSlash', () => {
    it('should return a slash failure if the name inclues a /', () => {
      const input = new FormControl('name/3');
      expect(component.validateSlash(input)).toEqual({
        slash: {
          valid: false
        }
      });
    });

    it('should return a slash failure if the name includes a ?', () => {
      const input = new FormControl('name3?');
      expect(component.validateSlash(input)).toEqual({
        slash: {
          valid: false
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

  describe('displays error message', () => {
    it('shows an error if the name is not unique', () => {
      component.form.controls['name'].setValue('name2');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name contains a /', () => {
      component.form.controls['name'].setValue('name/3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name contains a ?', () => {
      component.form.controls['name'].setValue('name3?');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
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

  describe('processForm', () => {
    it('displays a toastr warning if nothing changed', () => {
      spyOn(component.toastr, 'warning');
      component.processForm();
      expect(component.toastr.warning).toHaveBeenCalled();
    });

    describe('success', () => {
      beforeEach(() => {
        component.form.controls['name'].setValue('name3');
        component.form.controls['name'].markAsDirty();
        fixture.detectChanges();
      });

      it('calls saveView if there is a url', () => {
        spyOn(stateService.twiglet.viewService, 'saveView').and.returnValue(Observable.of({}));
        component.setup('url', 'name', 'description');
        component.processForm();
        expect(stateService.twiglet.viewService.saveView).toHaveBeenCalled();
      });

      it('calls createView if there is no url', () => {
        spyOn(stateService.twiglet.viewService, 'createView').and.returnValue(Observable.of({}));
        component.processForm();
        expect(stateService.twiglet.viewService.createView).toHaveBeenCalled();
      });
    })
  });

  describe('render', () => {
    it('tells the user they are overwriting when the view exists', () => {
      component.viewUrl = 'some.url';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.modal-title').innerText).toContain('Overwrite');
    });

    it('tells the user they are creating when it is a new view', () => {
      component.viewUrl = null;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.modal-title').innerText).toContain('Create');
    });
  });
});
