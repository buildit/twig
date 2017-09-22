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
import { D3Node, Link, ViewUserState } from '../../../non-angular/interfaces';
import { handleViewDataChanges } from './handleViewDataChanges';
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

fdescribe('TwigletGraphComponent:handleViewDataChanges', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let response: ViewUserState;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    spyOn(console, 'error');
    spyOn(stateServiceStubbed.userState, 'setSimulating');
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    spyOn(component, 'restart');
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    response = {
      filters: [{
        attributes: [],
        types: {},
      }],
      gravityPoints: {
        gp1: {
          id: 'id1', name: 'gp1', x: 100, y: 100,
        },
        gp2: {
          id: 'id2', name: 'gp2', x: 600, y: 1000,
        }
      },
      linkType: 'line',
      runSimulation: true,
    };
    component.userState = fromJS({});
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
  });

  fdescribe('treeMode', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if tree mode is does not change', () => {
      const newState = component.viewData.set(VIEW_DATA.TREE_MODE, false)
      handleViewDataChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if tree mode changes', () => {
      const newState = component.viewData.set(VIEW_DATA.TREE_MODE, true)
      handleViewDataChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  fdescribe('alphaTarget', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if alpha target changes does not change', () => {
      const newState = component.viewData.set(VIEW_DATA.ALPHA_TARGET, 0.5);
      handleViewDataChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if alpha target changes enabled', () => {
      const newState = component.viewData.set(VIEW_DATA.ALPHA_TARGET, 0.7);
      handleViewDataChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
    });

    it('sets the alpha target on the simulation', () => {
      const newState = component.viewData.set(VIEW_DATA.ALPHA_TARGET, 0.7);
      handleViewDataChanges.bind(component)(newState);
      expect(component.simulation.alphaTarget()).toEqual(0.7);
    });
  });

  describe('separationDistance', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if separationDistance does not change', () => {
      const newState = component.viewData.set(VIEW_DATA.SEPARATION_DISTANCE, 10);
      handleViewDataChanges.bind(component)(newState)
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if separationDistance changes', () => {
      const newState = component.viewData.set(VIEW_DATA.SEPARATION_DISTANCE, 20);
      handleViewDataChanges.bind(component)(newState);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('runSimulation', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    describe('[false]', () => {
      it('lets the user state know that no simulation is happening', () => {
        const newState = component.viewData.set(VIEW_DATA.RUN_SIMULATION, false);
        handleViewDataChanges.bind(component)(newState)
        expect(component.stateService.userState.setSimulating).toHaveBeenCalledWith(false);
      });

      it('stops the simulation', () => {
        spyOn(component.simulation, 'stop');
        const newState = component.viewData.set(VIEW_DATA.RUN_SIMULATION, false);
        handleViewDataChanges.bind(component)(newState)
        expect(component.simulation.stop).toHaveBeenCalledWith();
      });
    });

    describe('[true]', () => {
      it('updates the simulation if separationDistance changes', () => {
        const newState = component.viewData;
        component.viewData = component.viewData.set(VIEW_DATA.RUN_SIMULATION, false);
        handleViewDataChanges.bind(component)(newState);
        expect(component.updateSimulation).toHaveBeenCalled();
      });
    });
  });

  describe('showNodeLabels', () => {
    it('makes the labels invisible', () => {
      response.showNodeLabels = true;
      handleViewDataChanges.bind(component)(fromJS(response));

      response.showNodeLabels = false;
      handleViewDataChanges.bind(component)(fromJS(response));
      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).toContain('invisible');
    });

    it('makes the labels visible', () => {
      response.showNodeLabels = false;
      handleViewDataChanges.bind(component)(fromJS(response));

      response.showNodeLabels = true;
      handleViewDataChanges.bind(component)(fromJS(response));
      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).not.toContain('invisible');
    });
  });

  describe('showLinkLabels', () => {
    it('makes the link labels invisible', () => {
      response.showLinkLabels = true;
      handleViewDataChanges.bind(component)(fromJS(response));

      response.showLinkLabels = false;
      handleViewDataChanges.bind(component)(fromJS(response));
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).toContain('invisible');
    });

    it('makes the link labels visible', () => {
      response.showLinkLabels = false;
      handleViewDataChanges.bind(component)(fromJS(response));

      response.showLinkLabels = true;
      handleViewDataChanges.bind(component)(fromJS(response));
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).not.toContain('invisible');
    });
  });
});
