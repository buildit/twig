import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastrService,  } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { DeleteViewConfirmationComponent } from './delete-view-confirmation.component';
import { routerForTesting } from './../../app.router';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import SpyObj = jasmine.SpyObj;
// import createSpyObj = jasmine.createSpyObj;

describe('DeleteViewConfirmationComponent', () => {
  let component: DeleteViewConfirmationComponent;
  let fixture: ComponentFixture<DeleteViewConfirmationComponent>;
  let compiled;
  let router = { navigate: jasmine.createSpy('navigate') };
  let toastrServiceSpy: SpyObj<any>;

  beforeEach(async(() => {
    router = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      declarations: [ DeleteViewConfirmationComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        NgbActiveModal,
        { provide: ToastrService, useValue: toastrServiceSpy},
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: router },
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

  describe('deleting view', () => {
    it('closes the model if the form processes correclty', () => {
      spyOn(component.activeModal, 'close');
      spyOn(component.stateService.twiglet.viewService, 'deleteView').and.returnValue(Observable.of({}));
      component.view = Map({ name: 'some name' });
      component.twiglet = Map({ name: 'some twiglet name' });
      component.userState = Map({ currentViewName: 'some name' });
      component.deleteConfirmed();
      expect(component.activeModal.close).toHaveBeenCalled();
    });

    it('takes people back to the twiglet if the view is the current view', () => {
      spyOn(component.activeModal, 'close');
      spyOn(component.stateService.twiglet.viewService, 'deleteView').and.returnValue(Observable.of({}));
      component.view = Map({ name: 'some name' });
      component.twiglet = Map({ name: 'some twiglet name' });
      component.userState = Map({ currentViewName: 'some name' });
      component.deleteConfirmed();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('does nothing if the user is not currently viewing that view', () => {
      spyOn(component.activeModal, 'close');
      spyOn(component.stateService.twiglet.viewService, 'deleteView').and.returnValue(Observable.of({}));
      component.view = Map({ name: 'some name' });
      component.twiglet = Map({ name: 'some twiglet name' });
      component.userState = Map({ currentViewName: 'some other name' });
      component.deleteConfirmed();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('setup', () => {
    it('sets up the view', () => {
      const view = Map({});
      component.setup(view, Map({}), Map({}));
      expect(component.view).toBe(view);
    });

    it('sets up the twiglet', () => {
      const twiglet = Map({});
      component.setup(Map({}), twiglet, Map({}));
      expect(component.twiglet).toBe(twiglet);
    });

    it('sets up the userState', () => {
      const userState = Map({});
      component.setup(Map({}), Map({}), userState);
      expect(component.userState).toBe(userState);
    });

    it('sets the resource name', () => {
      const view = Map({ name: 'a name' });
      component.setup(view, Map({}), Map({}));
      expect(component.resourceName).toBe('a name');
    });
  });
});
