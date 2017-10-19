import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';
import { BreadcrumbNavigationComponent } from './../breadcrumb-navigation/breadcrumb-navigation.component';
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
import { DismissibleHelpModule } from './../../directives/dismissible-help/dismissible-help.module';
import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';

import USERSTATE from '../../../non-angular/services-helpers/userState/constants';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

describe('TwigletGraphComponent:handleViewDataChanges', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let stateServiceStubbed = stateServiceStub();
  let compiled;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    stateServiceStubbed.twiglet.updateNodes = () => undefined;

    const testBedSetup = {
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        DismissibleHelpDialogComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
        TwigletGraphComponent,
        BreadcrumbNavigationComponent,
        ViewDropdownComponent,
      ],
      imports: [ NgbModule.forRoot(), DismissibleHelpModule ],
      providers: [
        D3Service,
        NgbModal,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ToastsManager, useValue: mockToastr },
      ],
    };

    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    spyOn(console, 'error');
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  describe('treeMode', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setTreeMode(false);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if tree mode is does not change', () => {
      stateServiceStubbed.twiglet.viewService.setTreeMode(false);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if tree mode changes', () => {
      stateServiceStubbed.twiglet.viewService.setTreeMode(true);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('alphaTarget', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setAlphaTarget(0.5);
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if alpha target changes does not change', () => {
      stateServiceStubbed.twiglet.viewService.setAlphaTarget(0.5);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if alpha target changes enabled', () => {
      stateServiceStubbed.twiglet.viewService.setAlphaTarget(0.7);
      expect(component.updateSimulation).toHaveBeenCalled();
    });

    it('sets the alpha target on the simulation', () => {
      stateServiceStubbed.twiglet.viewService.setAlphaTarget(0.7);
      expect(component.simulation.alphaTarget()).toEqual(0.7);
    });
  });

  describe('separationDistance', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setSeparationDistance(10);
      spyOn(component, 'updateSimulation');
    });

    it('does not update the simulation if separationDistance does not change', () => {
      stateServiceStubbed.twiglet.viewService.setSeparationDistance(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if separationDistance changes', () => {
      stateServiceStubbed.twiglet.viewService.setSeparationDistance(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('runSimulation', () => {
    describe('[false]', () => {
      beforeEach(() => {
        spyOn(component.simulation, 'stop');
        spyOn(stateServiceStubbed.userState, 'setSimulating');
        stateServiceStubbed.twiglet.viewService.setRunSimulation(false);
      });

      it('lets the user state know that no simulation is happening', () => {
        stateServiceStubbed.twiglet.viewService.setRunSimulation(false);
        expect(stateServiceStubbed.userState.setSimulating).toHaveBeenCalledWith(false);
      });

      it('stops the simulation', () => {
        stateServiceStubbed.twiglet.viewService.setRunSimulation(false);
        expect(component.simulation.stop).toHaveBeenCalledWith();
      });
    });

    describe('[true]', () => {
      beforeEach(() => {
        stateServiceStubbed.twiglet.viewService.setRunSimulation(false);
        spyOn(component, 'updateSimulation');
      });

      it('updates the simulation if separationDistance changes', () => {
        stateServiceStubbed.twiglet.viewService.setRunSimulation(true);
        expect(component.updateSimulation).toHaveBeenCalled();
      });
    });
  });

  describe('showNodeLabels', () => {
    it('makes the labels visible', () => {
      stateServiceStubbed.twiglet.viewService.setShowNodeLabels(true);
      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).not.toContain('invisible');
    });

    it('makes the labels invisible', () => {
      stateServiceStubbed.twiglet.viewService.setShowNodeLabels(true);
      stateServiceStubbed.twiglet.viewService.setShowNodeLabels(false);

      const nodeText = compiled.querySelector('#id-firstNode')
                              .querySelector('.node-name').attributes as NamedNodeMap;
      expect(nodeText.getNamedItem('class').value).toContain('invisible');
    });
  });

  describe('showLinkLabels', () => {
    it('makes the link labels visible', () => {
      stateServiceStubbed.twiglet.viewService.setShowLinkLabels(true);
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).not.toContain('invisible');
    });

    it('makes the link labels invisible', () => {
      stateServiceStubbed.twiglet.viewService.setShowLinkLabels(true);
      stateServiceStubbed.twiglet.viewService.setShowLinkLabels(false);
      const labelText = compiled.querySelector('#id-firstLink')
        .querySelector('.link-name').attributes as NamedNodeMap;
      expect(labelText.getNamedItem('class').value).toContain('invisible');
    });
  });

  describe('linkType', () => {
    it('updates all of the link locations', () => {
      spyOn(component, 'updateLinkLocation');
      stateServiceStubbed.twiglet.viewService.setLinkType('line');
      expect(component.updateLinkLocation).toHaveBeenCalled();
    });
  });

  describe('forceChargeStrength', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceChargeStrength(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceChargeStrength does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceChargeStrength(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceChargeStrength changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceChargeStrength(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('forceGravityX', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceGravityX(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceGravityX does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceGravityX(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceGravityX changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceGravityX(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('forceGravityY', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceGravityY(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceGravityY does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceGravityY(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceGravityY changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceGravityY(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('forceLinkDistance', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceLinkDistance(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceLinkDistance does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceLinkDistance(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceLinkDistance changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceLinkDistance(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('forceLinkStrength', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceLinkStrength(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceLinkStrength does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceLinkStrength(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceLinkStrength changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceLinkStrength(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('forceVelocityDecay', () => {
    beforeEach(() => {
      stateServiceStubbed.twiglet.viewService.setForceVelocityDecay(10);
      spyOn(component, 'updateSimulation');
    })

    it('does not update the simulation if forceVelocityDecay does not change', () => {
      stateServiceStubbed.twiglet.viewService.setForceVelocityDecay(10);
      expect(component.updateSimulation).not.toHaveBeenCalled();
    });

    it('updates the simulation if forceVelocityDecay changes', () => {
      stateServiceStubbed.twiglet.viewService.setForceVelocityDecay(20);
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });

  describe('gravityPoints', () => {
    beforeEach(() => {
      spyOn(component, 'updateSimulation');
    });

    it('updates the simulations if the gravity points change', () => {
      stateServiceStubbed.twiglet.viewService.setGravityPoint({ id: 'some id', name: 'a name', x: 100, y: 100 })
      expect(component.updateSimulation).toHaveBeenCalled();
    });

    it('gravity points can be added', () => {
      stateServiceStubbed.twiglet.viewService.setGravityPoint({ id: 'some id', name: 'a name', x: 100, y: 100 })
      stateServiceStubbed.twiglet.viewService.setGravityPoints({
        id1: { id: 'id1', name: 'a name', x: 100, y: 100 },
        id2: { id: 'id2', name: 'another name', x: 200, y: 200 }
      })
      expect(component.updateSimulation).toHaveBeenCalled();
    });
  });
});
