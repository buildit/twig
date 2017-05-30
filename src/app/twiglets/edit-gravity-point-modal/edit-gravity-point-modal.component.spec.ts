import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { EditGravityPointModalComponent } from './edit-gravity-point-modal.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('EditGravityPointModalComponent', () => {
  let component: EditGravityPointModalComponent;
  let fixture: ComponentFixture<EditGravityPointModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGravityPointModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal,
        FormBuilder,
        ToastsManager,
        ToastOptions
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGravityPointModalComponent);
    component = fixture.componentInstance;
    component.gravityPoint = {
      id: 'id',
      name: 'gpname',
      x: 150,
      y: 200
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fills in the correct name if the gravity point has one', () => {
    expect(component.form.controls['name'].value).toEqual('gpname');
  });

  describe('validateUniqueName', () => {
    beforeEach(() => {
      component.gravityPointNames = ['gp1', 'gp2'];
      fixture.detectChanges();
    });

    it('passes if the name is not in gravityPointNames', () => {
      const c = new FormControl();
      c.setValue('gp3');
      expect(component.validateUniqueName(c)).toBeFalsy();
    });

    it('fails if the name is in gravityPointNames', () => {
      const c = new FormControl();
      c.setValue('gp2');
      fixture.detectChanges();
      expect(component.validateUniqueName(c)).toEqual({
        unique: {
          valid: false,
        }
      });
    });
  });

  describe('displays error message', () => {
    beforeEach(() => {
      component.gravityPointNames = ['gp1', 'gp2'];
      fixture.detectChanges();
    });

    it('shows an error if the name is not unique', () => {
      component.form.controls['name'].setValue('gp2');
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
        component.form.controls['name'].setValue('gp3');
        component.form.controls['name'].markAsDirty();
        fixture.detectChanges();
      });

      it('adds the gravity point to the user state', () => {
        const newGravityPoint = {
          id: 'id',
          name: 'gp3',
          x: 150,
          y: 200
        };
        spyOn(stateServiceStubbed.userState, 'setGravityPoint');
        component.processForm();
        expect(stateServiceStubbed.userState.setGravityPoint).toHaveBeenCalledWith(newGravityPoint);
      });

      it('closes the modal', () => {
        spyOn(component, 'closeModal');
        component.processForm();
        expect(component.closeModal).toHaveBeenCalled();
      });
    });
  });

  describe('delete gravity point', () => {
    beforeEach(() => {
      component.gravityPoints = {
        id: {
          id: 'id',
          name: 'gpname',
          x: 150,
          y: 200
        },
        id1: {
          id: 'id1',
          name: 'gp1',
          x: 202,
          y: 101
        },
        id2: {
          id: 'id2',
          name: 'gp2',
          x: 200,
          y: 300
        }
      };
      fixture.detectChanges();
    });

    it('removes the gravity point from gravity points', () => {
      component.deleteGravityPoint();
      fixture.detectChanges();
      expect(Object.keys(component.gravityPoints).length).toEqual(2);
    });

    it('sets the gravity points to the new gravity points object', () => {
      spyOn(stateServiceStubbed.userState, 'setGravityPoints');
      component.deleteGravityPoint();
      expect(stateServiceStubbed.userState.setGravityPoints).toHaveBeenCalled();
    });

    it('if it is a new gravity point it just closes the modal', () => {
      component.gravityPoint = {
        id: 'id',
        name: '',
        x: 150,
        y: 340
      };
      fixture.detectChanges();
      spyOn(stateServiceStubbed.userState, 'setGravityPoints');
      component.deleteGravityPoint();
      expect(stateServiceStubbed.userState.setGravityPoints).not.toHaveBeenCalled();
    });
  });
});
