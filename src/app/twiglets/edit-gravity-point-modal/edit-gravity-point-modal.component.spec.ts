import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';

import { EditGravityPointModalComponent } from './edit-gravity-point-modal.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('EditGravityPointModalComponent', () => {
  let component: EditGravityPointModalComponent;
  let fixture: ComponentFixture<EditGravityPointModalComponent>;
  let compRef;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGravityPointModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed }, NgbActiveModal, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGravityPointModalComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.gravityPoint = {
      id: 'id',
      name: '',
      x: 150,
      y: 200
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows an error if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      compRef.changeDetectorRef.markForCheck();
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
        spyOn(stateServiceStubbed.userState, 'addGravityPoint');
        component.processForm();
        expect(stateServiceStubbed.userState.addGravityPoint).toHaveBeenCalledWith(newGravityPoint);
      });

      it('closes the modal', () => {
        spyOn(component, 'closeModal');
        component.processForm();
        expect(component.closeModal).toHaveBeenCalled();
      });
    });
  });
});
