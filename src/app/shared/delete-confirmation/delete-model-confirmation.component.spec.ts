import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService,  } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { DeleteModelConfirmationComponent } from './delete-model-confirmation.component';
import { routerForTesting } from './../../app.router';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import MODEL from '../../../non-angular/services-helpers/models/constants';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('DeleteModelConfirmationComponent', () => {
  let component: DeleteModelConfirmationComponent;
  let fixture: ComponentFixture<DeleteModelConfirmationComponent>;
  let compiled;
  let toastrServiceSpy: SpyObj<any>;

  beforeEach(async(() => {
    toastrServiceSpy = createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [ DeleteModelConfirmationComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        NgbActiveModal,
        { provide: ToastrService, useValue: toastrServiceSpy},
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModelConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disables the submit button if the name is incorrectly typed', () => {
    component.inputName = 'not';
    component.resourceName = 'matching';
    fixture.detectChanges();
    const deleteButton = compiled.querySelector('button[type="submit"]');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeTruthy();
  });

  it('enables the submit button if the names match', () => {
    component.inputName = 'matching';
    component.resourceName = 'matching';
    fixture.detectChanges();
    const deleteButton = compiled.querySelector('button[type="submit"]');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeFalsy();
  });

  describe('deleting model', () => {
    beforeEach(() => {
      spyOn(component.stateService.model, 'updateListOfModels');
      spyOn(component.activeModal, 'close');
    });

    describe('success', () => {
      beforeEach(() => {
        spyOn(component.stateService.model, 'removeModel').and.returnValue(Observable.of({}));
        component.deleteConfirmed();
      });

      it('updates the list of models', () => {
        expect(component.stateService.model.updateListOfModels).toHaveBeenCalled();
      });

      it('closes the modal if the form processes correctly', () => {
        expect(component.activeModal.close).toHaveBeenCalled();
      });

      it('displays a success message', () => {
        expect(component.toastr.success).toHaveBeenCalled();
      });

      describe('rerouting', () => {
        it('reroutes to the correct page if the names are equal', () => {
          component.model = component.model.set(MODEL.NAME, 'matching');
          component.resourceName = 'matching';
          component.deleteConfirmed();
          expect(component.router.navigate).toHaveBeenCalled();
        });

        it('does no rerouting if the model is not the open one', () => {
          component.model = component.model.set(MODEL.NAME, 'not');
          component.resourceName = 'matching';
          component.deleteConfirmed();
          expect(component.router.navigate).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('errors', () => {
      beforeEach(() => {
        spyOn(console, 'error');
        spyOn(component.stateService.model, 'removeModel').and.returnValue(Observable.throw({statusText: 'whatever'}));
        component.deleteConfirmed();
      });

      it('does not close the modal', () => {
        expect(component.activeModal.close).not.toHaveBeenCalled();
      });

      it('displays an error message', () => {
        expect(component.toastr.error).toHaveBeenCalled();
      });
    });
  });
});
