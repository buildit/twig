import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { EditTwigletDetailsComponent } from './edit-twiglet-details.component';
import { fullTwigletMap, router, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { StateService } from './../../state.service';

describe('EditTwigletDetailsComponent', () => {
  let component: EditTwigletDetailsComponent;
  let fixture: ComponentFixture<EditTwigletDetailsComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwigletDetailsComponent ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal,
        ToastsManager,
        ToastOptions,
        {provide: Router, useValue: router() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwigletDetailsComponent);
    component = fixture.componentInstance;
    component.twigletNames = ['name1', 'name2'];
    component.twigletName = 'name1';
    component.currentTwiglet = 'name2';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateUniqueName', () => {
    it('passes if the name is not in twigletNames', () => {
      const c = new FormControl();
      c.setValue('name3');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('passes if the name is in twigletNames but is the original name', () => {
      component.twigletName = 'name2';
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
  });

  describe('displays error message', () => {
    beforeEach(() => {
      stateServiceStubbed.userState.setEditing(true);
    });

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

    it('shows no errors if the name validates', () => {
      component.form.controls['name'].setValue('name3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeFalsy();
    });
  });

  describe('process form', () => {
    it('displays a toastr warning if nothing changed', () => {
      spyOn(component.toastr, 'warning');
      fixture.nativeElement.querySelector('.submit').click();
      expect(component.toastr.warning).toHaveBeenCalled();
    });

    describe('success', () => {
      beforeEach(() => {
        component.form.controls['name'].setValue('name3');
        component.form.controls['name'].markAsDirty();
        fixture.detectChanges();
        spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      });

      it('sets the twiglet to the new name', () => {
        spyOn(stateServiceStubbed.twiglet, 'setName');
        fixture.nativeElement.querySelector('.submit').click();
        expect(stateServiceStubbed.twiglet.setName).toHaveBeenCalledWith('name3');
      });

      it('updates the list of twiglets', () => {
        spyOn(stateServiceStubbed.twiglet, 'updateListOfTwiglets');
        spyOn(stateServiceStubbed.userState, 'stopSpinner').and.returnValue(Observable.of({}));
        component.processForm();
        expect(stateServiceStubbed.twiglet.updateListOfTwiglets).toHaveBeenCalled();
      });

      it('refreshes the changelog', () => {
        spyOn(stateServiceStubbed.twiglet.changeLogService, 'refreshChangelog');
        component.processForm();
        expect(stateServiceStubbed.twiglet.changeLogService.refreshChangelog).toHaveBeenCalled();
      });
    });
  });
});
