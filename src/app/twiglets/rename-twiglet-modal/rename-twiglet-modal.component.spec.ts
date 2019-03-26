import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, List } from 'immutable';
import { ToastrService,  } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { fullTwigletMap, router, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { RenameTwigletModalComponent } from './rename-twiglet-modal.component';
import { StateService } from './../../state.service';
import SpyObj = jasmine.SpyObj;

describe('RenameTwigletModalComponent', () => {
  let component: RenameTwigletModalComponent;
  let fixture: ComponentFixture<RenameTwigletModalComponent>;
  let stateServiceStubbed = stateServiceStub();
  let mockRouter = router();
  let toastrServiceSpy: SpyObj<any>;


  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    mockRouter = router();
    TestBed.configureTestingModule({
      declarations: [ RenameTwigletModalComponent ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal,
        { provide: ToastrService, useValue: toastrServiceSpy},
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameTwigletModalComponent);
    component = fixture.componentInstance;
    component.twigletNames = ['name1', 'name2'];
    component.twigletName = 'name1';
    component.currentTwiglet = 'name2';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setupTwigletLists', () => {
    it('sets up the twiglet names', () => {
      component.setupTwigletLists(List([{ name: 'twig1', }, { name: 'twig2' }]));
      expect(component.twigletNames).toEqual(['twig1', 'twig2']);
    });
  });

  describe('ngOnInit', () => {
    it('does not navigate if the current twiglet is already loaded', () => {
      component.currentTwiglet = 'name1';
      component.ngOnInit();
      // the above would be the second call.
      expect(mockRouter.navigate).not.toHaveBeenCalledTimes(2);
    });
  });

  describe('ngAfterViewChecked', () => {
    it('does nothing if the form does not exist', () => {
      delete component.form;
      expect(component.ngAfterViewChecked()).toBe(false);
    });

    it('subscribes to form changes if the form exists', () => {
      const subscribe = spyOn(component.form.valueChanges, 'subscribe');
      component.ngAfterViewChecked();
      expect(subscribe).toHaveBeenCalled();
    });
  });

  describe('onValueChange', () => {
    it('does nothing if the form does not exist', () => {
      delete component.form;
      expect(component.onValueChanged()).toBe(false);
    });
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

    it('shows an error if the name contains a /', () => {
      component.form.controls['name'].setValue('name/3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name contains a ?', () => {
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

  describe('process form', () => {
    it('displays a toastr warning if nothing changed', () => {
      spyOn(component.toastr, 'warning');
      // spyOn(toastrServiceSpy, 'warning');
      component.processForm();
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
        component.processForm();
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
