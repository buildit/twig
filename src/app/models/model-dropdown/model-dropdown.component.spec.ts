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

describe('ModelDropdownComponent', () => {
  let component: ModelDropdownComponent;
  let fixture: ComponentFixture<ModelDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDropdownComponent, PrimitiveArraySortPipe ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStub() },
        { provide: Router, useValue: routerForTesting },
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
});
