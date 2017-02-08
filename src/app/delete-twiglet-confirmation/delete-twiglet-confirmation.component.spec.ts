import { Observable } from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* tslint:disable:no-unused-variable */
import { routerForTesting } from './../app.router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { DeleteTwigletConfirmationComponent } from './delete-twiglet-confirmation.component';

describe('DeleteTwigletConfirmationComponent', () => {
  let component: DeleteTwigletConfirmationComponent;
  let fixture: ComponentFixture<DeleteTwigletConfirmationComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTwigletConfirmationComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        NgbActiveModal,
        ToastsManager,
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTwigletConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disables the submit button if the name is incorrectly typed', () => {
    component.inputName = 'not';
    component.twigletName = 'matching';
    fixture.detectChanges();
    const deleteButton = compiled.querySelector('button.btn-danger');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeTruthy();
  });

  it('enables the submit button if the names match', () => {
    component.inputName = 'matching';
    component.twigletName = 'matching';
    fixture.detectChanges();
    const deleteButton = compiled.querySelector('button.btn-danger');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeFalsy();
  });

  describe('deleting twiglet', () => {
    beforeEach(() => {
      spyOn(component.stateService.twiglet, 'updateListOfTwiglets');
      spyOn(component.activeModal, 'close');
      spyOn(component.toastr, 'error');
      spyOn(component.toastr, 'success');
    });

    describe('success', () => {
      beforeEach(() => {
        spyOn(component.stateService.twiglet, 'removeTwiglet').and.returnValue(Observable.of({}));
        component.deleteConfirmed();
      });

      it('updates the list of twiglets', () => {
        expect(component.stateService.twiglet.updateListOfTwiglets).toHaveBeenCalled();
      });

      it('closes the model if the form processes correclty', () => {
        expect(component.activeModal.close).toHaveBeenCalled();
      });

      it('displays a success message', () => {
        expect(component.toastr.success).toHaveBeenCalled();
      });

      describe('rerouting', () => {
        it('reroutes to the correct page if the ids are equal', () => {
          component.twiglet = component.twiglet.set('name', 'matching');
          component.twigletName = 'matching';
          component.deleteConfirmed();
          expect(component.router.navigate).toHaveBeenCalled();
        });

        it('does no rerouting if the twiglet is not the open one', () => {
          component.twiglet = component.twiglet.set('name', 'not');
          component.twigletName = 'matching';
          component.deleteConfirmed();
          expect(component.router.navigate).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('errors', () => {
      beforeEach(() => {
        spyOn(component.stateService.twiglet, 'removeTwiglet').and.returnValue(Observable.throw({statusText: 'whatever'}));
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
