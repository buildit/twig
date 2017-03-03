import { Map } from 'immutable';
import { routerForTesting } from './../app.router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { DeleteViewConfirmationComponent } from './delete-view-confirmation.component';

describe('DeleteViewConfirmationComponent', () => {
  let component: DeleteViewConfirmationComponent;
  let fixture: ComponentFixture<DeleteViewConfirmationComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteViewConfirmationComponent ],
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
    fixture = TestBed.createComponent(DeleteViewConfirmationComponent);
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

  describe('deleting view', () => {
    it('closes the model if the form processes correclty', () => {
      spyOn(component.activeModal, 'close');
      spyOn(component.stateService.twiglet.viewService, 'deleteView').and.returnValue(Observable.of({}));
      component.view = Map({ name: 'some name' });
      component.deleteConfirmed();
      expect(component.activeModal.close).toHaveBeenCalled();
    });
  });
});
