import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { HeaderModelComponent } from './header-model.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { UserStateService } from './../../../non-angular/services-helpers/userState/index';

describe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let stateServiceStubbed;
  let fixture: ComponentFixture<HeaderModelComponent>;
  let fakeModalObservable;
  let closeModal;

  beforeEach(async(() => {
    closeModal = jasmine.createSpy('closeModal');
    stateServiceStubbed = stateServiceStub();
    fakeModalObservable = new ReplaySubject();
    TestBed.configureTestingModule({
      declarations: [
        HeaderModelComponent,
        ModelDropdownComponent,
        PrimitiveArraySortPipe
      ],
      imports: [
         NgbModule.forRoot(),
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: routerForTesting }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderModelComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      formValid: true,
      isEditing: true,
      mode: 'model',
      user: 'user'
    });
    component.models = modelsList();
    component.model = Map({
      changelog_url: 'modelurl/changelog',
      name: 'bsc',
      url: 'modelurl'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    describe('not editing', () => {
      beforeEach(() => {
        component.userState = Map({
          isEditing: false,
          mode: 'model',
          user: 'user'
        });
        fixture.detectChanges();
      });

      it('shows the dropdown', () => {
        expect(fixture.nativeElement.querySelector('app-model-dropdown')).toBeTruthy();
      });

      it('shows the new button if there is a user', () => {
        expect(fixture.nativeElement.querySelector('.fa-plus')).toBeTruthy();
      });

      it('hides the new button if there is no user', () => {
        component.userState = Map({
          isEditing: false,
          mode: 'model'
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.fa-plus')).toBeNull();
      });

      it('shows the edit button if there is a user and model', () => {
        expect(fixture.nativeElement.querySelector('.edit-btn')).toBeTruthy();
      });

      it('hides the edit button if there is no user', () => {
        component.userState = Map({
          isEditing: false,
          mode: 'model'
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.edit-btn')).toBeNull();
      });

      it('hides the edit button if there is no model', () => {
        component.model = Map({
          name: null
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.edit-btn')).toBeNull();
      });

      it('does not display the save/cancel button', () => {
        expect(fixture.nativeElement.querySelector('.pull-right.ml-auto')).toBeNull();
      });
    });

    describe('editing', () => {
      it('hides the dropdown and displays just the model name', () => {
        expect(fixture.nativeElement.querySelector('app-model-dropdown')).toBeNull();
        expect(fixture.nativeElement.querySelector('h4')).toBeTruthy();
      });

      it('does not show the new button', () => {
        expect(fixture.nativeElement.querySelector('.fa-plus')).toBeNull();
      });

      it('does not show the edit button', () => {
        expect(fixture.nativeElement.querySelector('.edit-btn')).toBeNull();
      });

      it('displays the save/cancel button', () => {
        expect(fixture.nativeElement.querySelector('.pull-right.ml-auto')).toBeTruthy();
      });
    });
  });

  describe('newModel', () => {
    it('opens a new model modal when new model is clicked', () => {
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setupModelLists: () => {} } });
      component.createNewModel();
      expect(component.modalService.open).toHaveBeenCalledWith(CreateModelModalComponent);
    });
  });

  describe('startEditing', () => {
    it('sets userstate Editing to true', () => {
      component.startEditing();
      stateServiceStubbed.userState.observable.first().subscribe((userState) => {
        expect(userState.get('isEditing')).toBeTruthy();
      });
    });
  });

  describe('stopEditing', () => {
    it('sets userstate Editing to false', () => {
      component.startEditing();
      component.discardChanges();
      stateServiceStubbed.userState.observable.first().subscribe((userState) => {
        expect(userState.get('isEditing')).toBeFalsy();
      });
    });
  });

  describe('saveModel', () => {
    beforeEach(() => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: {
          closeModal,
          observable: fakeModalObservable.asObservable()
        }
      });
    });

    it('opens the model', () => {
      component.saveModel();
      expect(component.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
    });

    describe('form results', () => {
      const bs = new BehaviorSubject({});
      beforeEach(() => {
        component.startEditing();
        spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue(bs.asObservable());
        spyOn(stateServiceStubbed.userState, 'startSpinner');
        spyOn(stateServiceStubbed.userState, 'stopSpinner');
        component.saveModel();
      });

      it('starts the spinner when the user responds to the form', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.startSpinner).toHaveBeenCalled();
      });

      it('saves the changes with the correct commit message', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.model.saveChanges).toHaveBeenCalledWith('a commit message');
      });

      it('stops editing mode if the user is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeFalsy();
        });
      });

      it('continues editing mode if the user chooses to', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeTruthy();
        });
      });

      it('closes the modal', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(closeModal).toHaveBeenCalled();
      });

      it('stops the spinner when everything is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.stopSpinner).toHaveBeenCalled();
      });
    });
  });
});
