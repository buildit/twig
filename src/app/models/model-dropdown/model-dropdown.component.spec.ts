import { DebugElement, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CloneModelModalComponent } from './../clone-model-modal/clone-model-modal.component';
import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { DeleteModelConfirmationComponent } from './../../shared/delete-confirmation/delete-model-confirmation.component';
import { EditModelDetailsComponent } from './../edit-model-details/edit-model-details.component';
import { ModelDropdownComponent } from './model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
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
      user: 'not null',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the models', () => {
    expect(fixture.nativeElement.querySelectorAll('li.model-list-item').length).toEqual(2);
  });

  it('opens a new model modal when new model is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setupModelLists: () => {} } });
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateModelModalComponent);
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
    fixture.nativeElement.querySelector('.fa-strikethrough').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditModelDetailsComponent);
  });

  it('opens the delete model modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { model: Map({}), resourceName: 'model1' }
    });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteModelConfirmationComponent);
  });
});
