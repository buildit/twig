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

import USERSTATE from '../../../non-angular/services-helpers/userState/constants';
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
      runSimulation: true,
    };
    component.userState = fromJS({
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
      runSimulation: true,
      scale: 3,
      separationDistance: 10,
      treeMode: false,
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

  describe('treeMode', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if tree mode is does not change', () => {
      const newState = component.userState.set(USERSTATE.TREE_MODE, false)
      handleUserStateChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if tree mode changes', () => {
      const newState = component.userState.set(USERSTATE.TREE_MODE, true)
      handleUserStateChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('alphaTarget', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if alpha target changes does not change', () => {
      const newState = component.userState.set(USERSTATE.ALPHA_TARGET, 0.5);
      handleUserStateChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if alpha target changes enabled', () => {
      const newState = component.userState.set(USERSTATE.ALPHA_TARGET, 0.7);
      handleUserStateChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
    });

    it('sets the alpha target on the simulation', () => {
      const newState = component.userState.set(USERSTATE.ALPHA_TARGET, 0.7);
      handleUserStateChanges.bind(component)(newState);
      expect(component.simulation.alphaTarget()).toEqual(0.7);
    });
  });

  describe('separationDistance', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if separationDistance does not change', () => {
      const newState = component.userState.set(USERSTATE.SEPARATION_DISTANCE, 10);
      handleUserStateChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if separationDistance changes', () => {
      const newState = component.userState.set(USERSTATE.SEPARATION_DISTANCE, 20);
      handleUserStateChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
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

  describe('runSimulation', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    describe('[false]', () => {
      it('lets the user state know that no simulation is happening', () => {
        const newState = component.userState.set(USERSTATE.RUN_SIMULATION, false);
        handleUserStateChanges.bind(component)(newState)
        expect(component.stateService.userState.setSimulating).toHaveBeenCalledWith(false);
      });

      it('stops the simulation', () => {
        spyOn(component.simulation, 'stop');
        const newState = component.userState.set(USERSTATE.RUN_SIMULATION, false);
        handleUserStateChanges.bind(component)(newState)
        expect(component.simulation.stop).toHaveBeenCalledWith();
      });
    });

    describe('[true]', () => {
      it('updates the simulation if separationDistance changes', () => {
        const newState = component.userState;
        component.userState = component.userState.set(USERSTATE.RUN_SIMULATION, false);
        handleUserStateChanges.bind(component)(newState);
        expect(component.updateSimulation).toHaveBeenCalled();
      });
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
