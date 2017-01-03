/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Inject } from '@angular/core';
import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { StateService, StateServiceStub } from '../state.service';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button.component';

describe('AddNodeByDraggingButtonComponent', () => {
  let component: AddNodeByDraggingButtonComponent;
  let fixture: ComponentFixture<AddNodeByDraggingButtonComponent>;
  const stateServiceStub = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodeByDraggingButtonComponent ],
      imports: [ NgbTooltipModule ],
      providers: [ NgbTooltipConfig, { provide: StateService, useValue: stateServiceStub} ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodeByDraggingButtonComponent);
    component = fixture.componentInstance;
    component.entity = {
      key: 'ent1',
      value: {
        class: 'bang',
        color: '#000000',
        image: '!',
        size: 10,
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('action', () => {
    it('should set the the node type to be added if disabled is false', () => {
      component.disabled = false;
      spyOn(stateServiceStub.userState, 'setNodeTypeToBeAdded');
      component.action('ent1');
      expect(stateServiceStub.userState.setNodeTypeToBeAdded).toHaveBeenCalled();
    });

    it('should do nothing if disabled is true.', () => {
      component.disabled = true;
      spyOn(stateServiceStub.userState, 'setNodeTypeToBeAdded');
      component.action('ent1');
      expect(stateServiceStub.userState.setNodeTypeToBeAdded).not.toHaveBeenCalled();
    });
  });
});
