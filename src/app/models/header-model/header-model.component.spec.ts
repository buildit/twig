import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { HeaderModelComponent } from './header-model.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { UserStateService } from './../../../non-angular/services-helpers/userState/index';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

describe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let stateServiceStubbed;
  let fixture: ComponentFixture<HeaderModelComponent>;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
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
    component.USERSTATE = USERSTATE_CONSTANTS;
    component.userState = Map({
      formValid: true,
      isEditing: false,
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
      beforeEach(() => {
        component.userState = Map({
          isEditing: true,
          mode: 'model'
        });
        fixture.detectChanges();
      });

      it('hides the dropdown and displays just the model name', () => {
        expect(fixture.nativeElement.querySelector('app-model-dropdown')).toBeNull();
      });

      it('does not show the new button', () => {
        expect(fixture.nativeElement.querySelector('.fa-plus')).toBeNull();
      });

      it('does not show the edit button', () => {
        expect(fixture.nativeElement.querySelector('.edit-btn')).toBeNull();
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
        expect(userState.get(component.USERSTATE.IS_EDITING)).toBeTruthy();
      });
    });
  });
});
