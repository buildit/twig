import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService,  } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { DeleteSequenceConfirmationComponent } from './delete-sequence-confirmation.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('DeleteSequenceConfirmationComponent', () => {
  let component: DeleteSequenceConfirmationComponent;
  let fixture: ComponentFixture<DeleteSequenceConfirmationComponent>;
  let compiled;
  let toastrServiceSpy: SpyObj<any>;

  beforeEach(async(() => {
    toastrServiceSpy = createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [ DeleteSequenceConfirmationComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        NgbActiveModal,
        { provide: ToastrService, useValue: toastrServiceSpy},
        { provide: StateService, useValue: stateServiceStub()},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSequenceConfirmationComponent);
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

  describe('deleting sequence', () => {
    beforeEach(() => {
      spyOn(component.stateService.twiglet.eventsService, 'deleteSequence').and.returnValue(Observable.of({}));
      spyOn(component.stateService.twiglet.eventsService, 'refreshSequences');
      spyOn(component.stateService.twiglet.eventsService, 'refreshEvents');
      spyOn(component.activeModal, 'close');
      component.deleteConfirmed();
    });

    it('updates the list of sequences', () => {
      expect(component.stateService.twiglet.eventsService.refreshSequences).toHaveBeenCalled();
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
      spyOn(component.stateService.twiglet.eventsService, 'deleteSequence').and.returnValue(Observable.throw({statusText: 'whatever'}));
      spyOn(console, 'error');
      // spyOn(component.toastr, 'error');
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
