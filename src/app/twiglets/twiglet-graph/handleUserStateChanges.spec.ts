import { View } from './../../../non-angular/interfaces/twiglet/view';
/* tslint:disable:no-unused-variable */
import { DebugElement, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { D3Node, Link } from '../../../non-angular/interfaces';
import { handleUserStateChanges } from './handleUserStateChanges';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { UserState } from './../../../non-angular/interfaces/userState/index';

import USERSTATE from '../../../non-angular/services-helpers/userState/constants';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.updateNodes = () => undefined;

const testBedSetup = {
  declarations: [
    AddNodeByDraggingButtonComponent,
    CopyPasteNodeComponent,
    HeaderTwigletComponent,
    HeaderTwigletEditComponent,
    TwigletDropdownComponent,
    TwigletGraphComponent
  ],
  imports: [ NgbModule.forRoot() ],
  providers: [
    D3Service,
    NgbModal,
    { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
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
    spyOn(console, 'error');
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.viewData = fromJS({
      alphaTarget: 0.5,
      forceChargeStrength: 20,
      forceGravityX: 20,
      forceGravityY: 20,
      forceLinkDistance: 20,
      forceLinkStrength: 20,
      forceVelocityDecay: 20,
      gravityPoints: {},
      highlightedNode: null,
      isEditingGravity: false,
      linkType: 'line',
      runSimulation: true,
      scale: 3,
      separationDistance: 10,
      treeMode: false,
    });
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    response = {
      currentNode: null,
      isEditing: false,
    };
    component.userState = fromJS({
      currentNode: null,
      highlightedNode: null,
      isEditing: false,
      isEditingGravity: false,
    });
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

    it('calls updateLinkLocation and updateCircleLocation if an update comes while in edit mode', () => {
      spyOn(component, 'updateLinkLocation');
      spyOn(component, 'updateCircleLocation');
      stateServiceStubbed.userState.setEditing(true);
      expect(component.updateLinkLocation).toHaveBeenCalled()
    })
  });

  describe('currentNode', () => {
    it('adds a glow filter to the nodes', () => {
      stateServiceStubbed.userState.setCurrentNode('firstNode');
      const nodeAttributes = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-image').attributes as NamedNodeMap;
      expect(nodeAttributes.getNamedItem('filter')).toBeTruthy();
    });

    it('removes the glow filter from the old currentNode and sets it to the new currentNode', () => {
      // Pre-state
      stateServiceStubbed.userState.setCurrentNode('firstNode');

      // Setup
      stateServiceStubbed.userState.setCurrentNode('secondNode');

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

  describe('highlightedNode', () => {
    describe('highlighting', () => {
      it('can highlight an origin node', () => {
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, 'firstNode');
        handleUserStateChanges.bind(component)(newState);
        expect(component.d3Svg.select(`#id-firstNode`).select('.node-image').attr('filter')).toEqual('url(#glow)');
      });

      it('can highlight an child nodes', () => {
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, 'firstNode');
        handleUserStateChanges.bind(component)(newState);
        expect(component.d3Svg.select(`#id-secondNode`).select('.node-image').attr('filter')).toEqual('url(#nodetree)');
      });
    });

    describe('unhighlighting', () => {
      beforeEach(() => {
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, 'firstNode');
        handleUserStateChanges.bind(component)(newState);
      });

      it('can unhighlight an origin node', () => {
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, null);
        handleUserStateChanges.bind(component)(newState);
        expect(component.d3Svg.select(`#id-firstNode`).select('.node-image').attr('filter')).toBeFalsy();
      });

      it('can unhighlight an child nodes', () => {
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, null);
        handleUserStateChanges.bind(component)(newState);
        expect(component.d3Svg.select(`#id-secondNode`).select('.node-image').attr('filter')).toBeFalsy();
      });

      it('does not unhighlight nodes if they are the current node', () => {
        component.userState = component.userState.set(USERSTATE.CURRENT_NODE, 'firstNode');
        const newState = component.userState.set(USERSTATE.HIGHLIGHTED_NODE, null);
        handleUserStateChanges.bind(component)(newState);
        expect(component.d3Svg.select(`#id-firstNode`).select('.node-image').attr('filter')).toEqual('url(#glow)');
      })
    });
  });

  describe('textToFilterOn and filterEntities', () => {
    it('greys out nodes that do not match search and filterEntities parameters', () => {
      stateServiceStubbed.userState.setTextToFilterOn('first');

      const firstNode = compiled.querySelector('#id-firstNode').attributes as NamedNodeMap;
      expect(firstNode.getNamedItem('style').value).toContain('opacity: 1');

      const secondNode = compiled.querySelector('#id-secondNode').attributes as NamedNodeMap;
      expect(secondNode.getNamedItem('style').value).toContain('opacity: 0.1');
    });
  });
});
