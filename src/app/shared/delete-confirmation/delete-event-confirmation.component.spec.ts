import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { DeleteEventConfirmationComponent } from './delete-event-confirmation.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('DeleteEventConfirmationComponent', () => {
  let component: DeleteEventConfirmationComponent;
  let fixture: ComponentFixture<DeleteEventConfirmationComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteEventConfirmationComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        NgbActiveModal,
        ToastsManager,
        ToastOptions,
        { provide: StateService, useValue: stateServiceStub()},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEventConfirmationComponent);
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
    const deleteButton = compiled.querySelector('button.warning');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeTruthy();
  });

  it('enables the submit button if the names match', () => {
    component.inputName = 'matching';
    component.resourceName = 'matching';
    fixture.detectChanges();
    const deleteButton = compiled.querySelector('button.warning');
    expect((deleteButton.attributes.getNamedItem('disabled'))).toBeFalsy();
  });

  describe('deleting event', () => {
    beforeEach(() => {
      spyOn(component.stateService.twiglet.eventsService, 'deleteEvent').and.returnValue(Observable.of({}));
      spyOn(component.stateService.twiglet.eventsService, 'refreshEvents');
      spyOn(component.activeModal, 'close');
      spyOn(component.toastr, 'success');
      component.deleteConfirmed();
    });

    it('updates the list of events', () => {
      expect(component.stateService.twiglet.eventsService.refreshEvents).toHaveBeenCalled();
    });

    it('closes the modal if the form processes correclty', () => {
      expect(component.activeModal.close).toHaveBeenCalled();
    });

    it('displays a success message', () => {
      expect(component.toastr.success).toHaveBeenCalled();
    });
  });

  describe('errors when deleting', () => {
    beforeEach(() => {
      spyOn(console, 'error');
      spyOn(component.stateService.twiglet.eventsService, 'deleteEvent').and.returnValue(Observable.throw({statusText: 'whatever'}));
      spyOn(component.toastr, 'error');
      spyOn(component.activeModal, 'close');
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
