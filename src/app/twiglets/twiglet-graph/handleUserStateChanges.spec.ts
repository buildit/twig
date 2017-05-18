import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
/* tslint:disable:no-unused-variable */
import { DebugElement, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS } from 'immutable';

import { D3Node, Link } from '../../../non-angular/interfaces';
import { handleUserStateChanges } from './handleUserStateChanges';
import { StateService } from '../../state.service';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { UserState } from './../../../non-angular/interfaces/userState/index';

import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.updateNodes = () => undefined;


const testBedSetup = {
  declarations: [ TwigletGraphComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
    { provide: StateService, useValue: stateServiceStubbed },
    { provide: ToastsManager, useValue: mockToastr },
  ],
};


describe('TwigletGraphComponent:handleUserStateChanges', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let response: UserState;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    spyOn(stateServiceStubbed.userState, 'setSimulating');
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    response = {
      currentNode: null,
      filters: {
        attributes: [],
        types: {},
      },
      gravityPoints: {
        gp1: {
          id: 'id1', name: 'gp1', x: 100, y: 100,
        },
        gp2: {
          id: 'id2', name: 'gp2', x: 600, y: 1000,
        }
      },
      isEditing: false,
      linkType: 'line',
    };
  });

  describe('isEditing', () => {

    it('restarts the simulation when this.view.isEditing turns false', () => {
      response.isEditing = true;
      handleUserStateChanges.bind(component)(fromJS(response));
      spyOn(component, 'restart');
      response.isEditing = false;
      handleUserStateChanges.bind(component)(fromJS(response));

      expect(component.restart).toHaveBeenCalled();
    });

    it('makes the circles on links visible', () => {
      response.isEditing = true;
      handleUserStateChanges.bind(component)(fromJS(response));

      const circles = compiled.querySelector('.circle').attributes as NamedNodeMap;
      expect(circles.getNamedItem('class').value).not.toContain('invisible');
    });

    it('hides the circles on links when user is not editing', () => {
      const circles = compiled.querySelector('.circle').attributes as NamedNodeMap;
      expect(circles.getNamedItem('class').value).toContain('invisible');
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

  describe('showLinkLabels', () => {
    it('makes the link labels invisible', () => {
      response.showLinkLabels = true;
      handleUserStateChanges.bind(component)(fromJS(response));

      response.showLinkLabels = false;
      handleUserStateChanges.bind(component)(fromJS(response));
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).toContain('invisible');
    });

    it('makes the link labels visible', () => {
      response.showLinkLabels = false;
      handleUserStateChanges.bind(component)(fromJS(response));

      response.showLinkLabels = true;
      handleUserStateChanges.bind(component)(fromJS(response));
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).not.toContain('invisible');
    });
  });

  describe('textToFilterOn and filterEntities', () => {
    it('greys out nodes that do not match search and filterEntities parameters', () => {
      response.textToFilterOn = 'first';
      handleUserStateChanges.bind(component)(fromJS(response));

      const firstNode = compiled.querySelector('#id-firstNode').attributes as NamedNodeMap;
      expect(firstNode.getNamedItem('style').value).toContain('opacity: 1');

      const secondNode = compiled.querySelector('#id-secondNode').attributes as NamedNodeMap;
      expect(secondNode.getNamedItem('style').value).toContain('opacity: 0.1');
    });
  });
});
