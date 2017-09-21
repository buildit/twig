import { DebugElement, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CloneModelModalComponent } from './../clone-model-modal/clone-model-modal.component';
import { DeleteModelConfirmationComponent } from './../../shared/delete-confirmation/delete-model-confirmation.component';
import { ModelDropdownComponent } from './model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { RenameModelModalComponent } from './../rename-model-modal/rename-model-modal.component';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import MODEL from '../../../non-angular/services-helpers/models/constants';

describe('ModelDropdownComponent', () => {
  let component: ModelDropdownComponent;
  let fixture: ComponentFixture<ModelDropdownComponent>;
  let stateServiceStubbed: StateService;
  let router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    router = { navigate: jasmine.createSpy('navigate') };
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ModelDropdownComponent, PrimitiveArraySortPipe ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: router },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDropdownComponent);
    component = fixture.componentInstance;
    component.models = modelsList();
    component.userState = Map({
      mode: 'model',
      user: 'not null',
    });
    component.model = Map({
      name: 'name'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the models', () => {
    expect(fixture.nativeElement.querySelectorAll('li.model-list-item').length).toEqual(2);
  });

  it('loads a model when that model name is clicked', () => {
    spyOn(component, 'loadModel');
    fixture.nativeElement.querySelector('.clickable.col-6').click();
    expect(component.loadModel).toHaveBeenCalledWith('model1');
  });

  it('clears the current twiglet when a model is loaded', () => {
    spyOn(stateServiceStubbed.twiglet, 'clearCurrentTwiglet');
    component.loadModel('a name');
    expect(stateServiceStubbed.twiglet.clearCurrentTwiglet).toHaveBeenCalled();
  });

  it('navigates to that model when a model is loaded', () => {
    component.loadModel('a name');
    expect(router.navigate).toHaveBeenCalledWith(['/model', 'a name']);
  });

  it('opens the clone model modal when the clone icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { setupModelLists: () => {}, model: Map({}), modelName: 'model1' }
    });
    fixture.nativeElement.querySelector('.fa-files-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CloneModelModalComponent);
  });

  it('opens the rename model modal when the rename icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { setupModelLists: () => {}, modelName: 'model1' }
    });
    fixture.nativeElement.querySelector('.fa-pencil').click();
    expect(component.modalService.open).toHaveBeenCalledWith(RenameModelModalComponent);
  });

  it('opens the delete model modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { model: Map({}), resourceName: 'model1' }
    });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteModelConfirmationComponent);
  });

  describe('display', () => {
    describe('current model name or no model selected', () => {
      it('displays the current model name if there is a model', () => {
        expect(fixture.nativeElement.querySelector('#current-model-info')).toBeTruthy();
      });

      it('asks the user to pick a model if there is no model name', () => {
        component.model = component.model.set(MODEL.NAME, null);
        component['cd'].markForCheck();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#please-select-a-model')).toBeTruthy();
      });
    });

    describe('with user', () => {
      it('shows the clone button', () => {
        expect(fixture.nativeElement.querySelector('.fa-files-o')).toBeTruthy();
      });

      it('shows the rename button', () => {
        expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeTruthy();
      });

      it('shows the delete button', () => {
        expect(fixture.nativeElement.querySelector('.fa-trash')).toBeTruthy();
      });
    });

    describe('no user', () => {
      beforeEach(() => {
        component.userState = Map({
          mode: 'model',
          user: null,
        });
        component['cd'].markForCheck();
        fixture.detectChanges();
      });

      it('hides the clone button', () => {
        expect(fixture.nativeElement.querySelector('.fa-files-o')).toBeNull();
      });

      it('hides the rename button', () => {
        expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeNull();
      });

      it('hides the delete button', () => {
        expect(fixture.nativeElement.querySelector('.fa-trash')).toBeNull();
      });
    });
  });
});
