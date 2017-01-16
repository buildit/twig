import { UserState } from './../../non-angular/interfaces/userState/index';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { handleUserStateChanges } from './handleUserStateChanges';

fdescribe('TwigletGraphComponent:handleUserStateChanges', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let response: UserState;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletGraphComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ D3Service, NgbModal, { provide: StateService, useValue: new StateServiceStub()} ]
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
      filterEntities: [],
      isEditing: false,
    };
  });

  describe('isEditing', () => {
    xit('fixes the nodes when this.userState.isEditing turns true', () => {
      response.isEditing = true;
      // Expect the simulation to be stopped.
    });

    it('removes any fixing on the nodes when this.view.isEditing turns false', () => {
      // Setup
      response.isEditing = true;
      handleUserStateChanges.bind(component)(fromJS(response));

      response.isEditing = false;
      handleUserStateChanges.bind(component)(fromJS(response));
      component.currentlyGraphedNodes.forEach(node => {
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
  });

  describe('currentNode', () => {
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

    it('removes the glow filter from the old currentNode if there is no more current node', () => {
      response.currentNode = 'firstNode';
      handleUserStateChanges.bind(component)(fromJS(response));

      response.currentNode = null;
      handleUserStateChanges.bind(component)(fromJS(response));

      const oldNodeAttributes = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-image').attributes as NamedNodeMap;
      expect(oldNodeAttributes.getNamedItem('filter')).toBeFalsy();
    });
  });

  describe('showNodeLabels', () => {
    it('makes the labels invisible', () => {
      response.showNodeLabels = true;
      handleUserStateChanges.bind(component)(fromJS(response));

      response.showNodeLabels = false;
      handleUserStateChanges.bind(component)(fromJS(response));
      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).toContain('invisible');
    });

    it('makes the labels visible', () => {
      response.showNodeLabels = false;
      handleUserStateChanges.bind(component)(fromJS(response));

      response.showNodeLabels = true;
      handleUserStateChanges.bind(component)(fromJS(response));
      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).not.toContain('invisible');
    });
  });

  describe('textToFilterOn and filterEntities', () => {
    it('greys out nodes that do not match search and filterEntities parameters', () => {
      response.textToFilterOn = 'first';
      response.filterEntities = ['ent1'];
      handleUserStateChanges.bind(component)(fromJS(response));

      const firstNode = compiled.querySelector('#id-firstNode').attributes as NamedNodeMap;
      expect(firstNode.getNamedItem('style').value).toContain('opacity: 1');

      const secondNode = compiled.querySelector('#id-secondNode').attributes as NamedNodeMap;
      expect(secondNode.getNamedItem('style').value).toContain('opacity: 0.1');
    });
  });
});
