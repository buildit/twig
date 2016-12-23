/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';

import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { handleUserStateChanges } from './handleUserStateChanges';
import { UserStateServiceResponse } from '../../non-angular/services-helpers';

describe('TwigletGraphComponent:locationHelpers', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let response: UserStateServiceResponse;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletGraphComponent ],
      providers: [ D3Service, { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    response = {
      currentNode: null,
      isEditing: false,
    };
  });

  it('fixes the nodes when this.userState.isEditing turns true', () => {
    response.isEditing = true;
    handleUserStateChanges.bind(component)(fromJS(response));
    component.currentNodes.forEach(node => {
      expect(node.fx).toEqual(node.x);
      expect(node.fy).toEqual(node.y);
    });
  });

  it('removes any fixing on the nodes when this.view.isEditing turns false', () => {
    // Setup
    response.isEditing = true;
    handleUserStateChanges.bind(component)(fromJS(response));

    response.isEditing = false;
    handleUserStateChanges.bind(component)(fromJS(response));
    component.currentNodes.forEach(node => {
      expect(node.fx).toBeFalsy();
      expect(node.fy).toBeFalsy();
    });
  });

  it('restarts the simulation when this.view.isEditing turns false', () => {
    response.isEditing = true;
    handleUserStateChanges.bind(component)(fromJS(response));
    spyOn(component, 'restart');
    response.isEditing = false;
    handleUserStateChanges.bind(component)(fromJS(response));

    expect(component.restart).toHaveBeenCalled();
  });

  it('adds a glow filter to the nodes', () => {
    response.currentNode = 'firstNode';
    handleUserStateChanges.bind(component)(fromJS(response));

    const nodeAttributes = compiled.querySelector('#id-firstNode')
                            .querySelector('.node-image').attributes as NamedNodeMap;
    expect(nodeAttributes.getNamedItem('filter')).toBeTruthy();
  });

  it('removes the glow filter from the old currentNode and sets it to the new currentNode', () => {
    // Pre-state
    response.currentNode = 'firstNode';
    handleUserStateChanges.bind(component)(fromJS(response));

    // Setup
    response.currentNode = 'secondNode';
    handleUserStateChanges.bind(component)(fromJS(response));

    const oldNodeAttributes = compiled.querySelector('#id-firstNode')
                            .querySelector('.node-image').attributes as NamedNodeMap;
    expect(oldNodeAttributes.getNamedItem('filter')).toBeFalsy();
    const newNodeAttributes = compiled.querySelector('#id-secondNode')
                            .querySelector('.node-image').attributes as NamedNodeMap;
    expect(newNodeAttributes.getNamedItem('filter')).toBeTruthy();
  });
});
