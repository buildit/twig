/* tslint:disable:no-unused-variable */
import { Map } from 'immutable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Inject } from '@angular/core';
import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button.component';

describe('AddNodeByDraggingButtonComponent', () => {
  let component: AddNodeByDraggingButtonComponent;
  let fixture: ComponentFixture<AddNodeByDraggingButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodeByDraggingButtonComponent ],
      imports: [ NgbTooltipModule ],
      providers: [ NgbTooltipConfig, { provide: StateService, useValue: stateServiceStubbed} ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodeByDraggingButtonComponent);
    component = fixture.componentInstance;
    component.entity = Map({
        class: 'bang',
        color: '#000000',
        image: '!',
        size: 10,
        type: 'ent1',
    });
    component.userState = Map({
      isEditing: true
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('action', () => {
    it('should set the the node type to be added if disabled is false', () => {
      spyOn(stateServiceStubbed.userState, 'setNodeTypeToBeAdded');
      component.action('ent1');
      expect(stateServiceStubbed.userState.setNodeTypeToBeAdded).toHaveBeenCalled();
    });

    it('should do nothing if disabled is true.', () => {
      component.userState = component.userState.set('isEditing', false);
      spyOn(stateServiceStubbed.userState, 'setNodeTypeToBeAdded');
      component.action('ent1');
      expect(stateServiceStubbed.userState.setNodeTypeToBeAdded).not.toHaveBeenCalled();
    });
  });
});
