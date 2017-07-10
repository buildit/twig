import { UserStateService } from './../../../non-angular/services-helpers/userState/index';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';

import { HeaderModelComponent } from './header-model.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';

describe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let stateServiceStubbed;
  let fixture: ComponentFixture<HeaderModelComponent>;
  let fakeModalObservable;
  let fakeModalService;
  let closeModal;

  beforeEach(async(() => {
    closeModal = jasmine.createSpy('closeModal');
    stateServiceStubbed = stateServiceStub();
    fakeModalObservable = new ReplaySubject();
    fakeModalService = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {
          closeModal,
          observable: fakeModalObservable.asObservable(),
        },
      }),
    };
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
        { provide: NgbModal, useValue: fakeModalService },
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
    it('opens the model', () => {
      component.saveModel();
      expect(fakeModalService.open).toHaveBeenCalled();
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
