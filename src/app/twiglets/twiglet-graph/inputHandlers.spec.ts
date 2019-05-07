import { BreadcrumbNavigationComponent } from './../breadcrumb-navigation/breadcrumb-navigation.component';
import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';
import { DebugElement, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3, D3Service } from 'd3-ng2-service';
import { Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { clone } from 'ramda';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { D3Node, Link } from '../../../non-angular/interfaces';
import { EditGravityPointModalComponent } from './../edit-gravity-point-modal/edit-gravity-point-modal.component';
import { EditLinkModalComponent } from './../edit-link-modal/edit-link-modal.component';
import { EditNodeModalComponent } from './../edit-node-modal/edit-node-modal.component';
import { GravityPoint, UserState } from './../../../non-angular/interfaces/userState/index';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { LoadingSpinnerComponent } from './../../shared/loading-spinner/loading-spinner.component';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { clickLink, dblClickNode, dragEnded, dragged, dragStarted, mouseDownOnNode, mouseMoveOnCanvas,
    mouseUpOnCanvas, mouseUpOnNode, nodeClicked, mouseUpOnGravityPoint, gravityPointDragged,
    gravityPointDragEnded, gravityPointDragStart } from './inputHandlers';
import { DismissibleHelpModule } from './../../directives/dismissible-help/dismissible-help.module';
import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

describe('TwigletGraphComponent:inputHandlers', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  let compiled;
  let response: UserState;
  const stateServiceStubbed = stateServiceStub();
  const testNode = {
    attrs: [],
    id: 'secondNode',
    name: 'secondNodeName',
    radius: 10,
    type: 'ent2',
    x: 200,
    y: 300,
  } as D3Node;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        DismissibleHelpDialogComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
        TwigletGraphComponent,
        ViewDropdownComponent,
        BreadcrumbNavigationComponent,
      ],
      imports: [ NgbModule.forRoot(), DismissibleHelpModule ],
      providers: [
        D3Service,
        NgbModal,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    response = {
      currentNode: null,
      isEditing: true,
    };
  });

  describe('nodeClicked', () => {
    it('sets the current node if a node is clicked', () => {
      spyOn(stateServiceStubbed.userState, 'setCurrentNode');
      nodeClicked.bind(component)(testNode);
      expect(stateServiceStubbed.userState.setCurrentNode).toHaveBeenCalled();
    });

    it('collapses the nodes if clicked with alt', () => {
      component.altPressed = true;
      fixture.detectChanges();
      spyOn(stateServiceStubbed.twiglet, 'collapseNode')
      nodeClicked.bind(component)(testNode);
      expect(stateServiceStubbed.twiglet.collapseNode).toHaveBeenCalled();
    });

    it('flowers the nodes if clicked with alt and already collapsed', () => {
      component.altPressed = true;
      fixture.detectChanges();
      const collapsedNode = clone(testNode);
      collapsedNode.collapsed = true;
      spyOn(stateServiceStubbed.twiglet, 'flowerNode')
      nodeClicked.bind(component)(collapsedNode);
      expect(stateServiceStubbed.twiglet.flowerNode).toHaveBeenCalled();
    });

    it('cascade collapses the nodes if clicked with alt and mode is cascade collapse ', () => {
      component.viewData = component.viewData.set(VIEW_DATA.CASCADING_COLLAPSE, true);
      component.altPressed = true;
      fixture.detectChanges();
      spyOn(stateServiceStubbed.twiglet, 'collapseNodeCascade')
      nodeClicked.bind(component)(testNode);
      expect(stateServiceStubbed.twiglet.collapseNodeCascade).toHaveBeenCalled();
    });

    it('flowers the nodes if clicked with alt and already collapsed', () => {
      component.viewData = component.viewData.set(VIEW_DATA.CASCADING_COLLAPSE, true);
      component.altPressed = true;
      fixture.detectChanges();
      const collapsedNode = clone(testNode);
      collapsedNode.collapsed = true;
      spyOn(stateServiceStubbed.twiglet, 'flowerNodeCascade')
      nodeClicked.bind(component)(collapsedNode);
      expect(stateServiceStubbed.twiglet.flowerNodeCascade).toHaveBeenCalled();
    });
  });

  describe('click link', () => {
    it('opens the edit link modal', () => {
      const testLink = {
        association: 'secondLink',
        id: 'secondLink',
        source: 'thirdNode',
        target: 'firstNode',
      } as Link;
      stateServiceStubbed.userState.setEditing(true);
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: { id: 'id', twiglet: 'twiglet' }
      });
      clickLink.bind(component)(testLink);
      expect(component.modalService.open).toHaveBeenCalledWith(EditLinkModalComponent);
    });
  });

  describe('double click node', () => {
    it('brings up the edit node modal if the user is editing', () => {
      stateServiceStubbed.userState.setEditing(true);
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: { id: 'id', twiglet: Map({}), twigletModel: Map({}) }
      });
      dblClickNode.bind(component)(testNode);
      expect(component.modalService.open).toHaveBeenCalledWith(EditNodeModalComponent);
    });

    it('sets node.fx and node.fy if they are null', () => {
      stateServiceStubbed.userState.setEditing(false);
      testNode.fx = null;
      testNode.fy = null;
      dblClickNode.bind(component)(testNode);
      expect(testNode.fx).toEqual(testNode.x);
    });
  });

  describe('mouseUpOnCanvas', () => {
    it('clears the current node if there is one', () => {
      spyOn(stateServiceStubbed.userState, 'clearCurrentNode');
      stateServiceStubbed.userState.setCurrentNode('nodeId');
      mouseUpOnCanvas(component)();
      expect(stateServiceStubbed.userState.clearCurrentNode).toHaveBeenCalled();
    });

    it('opens the edit node modal if there is a node type to be added', () => {
      const d3 = component.d3;
      const stubbedD3 = new Proxy({}, {
        get(target, arg) {
          if (arg === 'mouse') {
            return () => [100, 200];
          }
          return d3[arg];
        }
      }) as any as D3;
      component.d3 = stubbedD3;
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: { id: 'id', twiglet: Map({}), twigletModel: Map({}) }
      });
      stateServiceStubbed.userState.setNodeTypeToBeAdded('ent1');
      mouseUpOnCanvas(component)();
      expect(component.modalService.open).toHaveBeenCalledWith(EditNodeModalComponent);
    });
  });

  describe('mouseMoveOnCanvas', () => {
    it('sets the attributes for the tempLinkLine', () => {
      component.tempLink = {
        association: 'secondLink',
        id: 'secondLink',
        source: 'secondNode',
        target: '',
      } as Link;
      const d3 = component.d3;
      const stubbedD3 = new Proxy({}, {
        get(target, arg) {
          if (arg === 'mouse') {
            return () => [100, 200];
          }
          return d3[arg];
        }
      }) as any as D3;
      component.d3 = stubbedD3;
      mouseDownOnNode.bind(component)(testNode);
      mouseMoveOnCanvas(component)();
      expect(component.tempLinkLine.attr('x2')).toEqual('100');
    });
  });

  describe('mouseUpOnNode', () => {
    it('adds a link if the source is not the target', () => {
      const firstNode = {
        attrs: [],
        id: 'firstId',
        name: 'secondNodeName',
        radius: 10,
        type: 'ent2',
        x: 200,
        y: 300,
      } as D3Node;
      component.tempLink = {
        association: 'secondLink',
        id: 'secondLink',
        source: 'thirdNode',
        target: '',
      } as Link;
      spyOn(stateServiceStubbed.twiglet, 'addLink');
      mouseDownOnNode.bind(component)(firstNode);
      mouseUpOnNode.bind(component)(testNode);
      expect(stateServiceStubbed.twiglet.addLink).toHaveBeenCalled();
    });
  });

  describe('drag', () => {
    it('sets node fx and fy when drag started', () => {
      dragStarted.bind(component)(testNode);
      expect(testNode.fx).toEqual(testNode.x);
    });

    it('updates the node fx and fy when dragged', () => {
      const d3 = component.d3;
      const stubbedD3 = new Proxy({}, {
        get(target, arg) {
          if (arg === 'event') {
            return {
              x: 250,
              y: 350
            };
          }
          return d3[arg];
        }
      }) as any as D3;
      component.d3 = stubbedD3;
      dragged.bind(component)(testNode);
      expect(testNode.fx).toEqual(250);
    });

    it('updates the node when drag ended', () => {
      testNode.fx = 500;
      testNode.fy = 500;
      testNode.sx = 200;
      testNode.sy = 300;
      spyOn(stateServiceStubbed.twiglet, 'updateNode');
      dragEnded.bind(component)(testNode);
      expect(stateServiceStubbed.twiglet.updateNode).toHaveBeenCalled();
    });
  });

  describe('gravityPointDragStart', () => {
    let gp: GravityPoint;
    beforeEach(() => {
      gp = {
        id: 'gp1',
        name: 'gp1 Name',
        x: 100,
        y: 200,
      };
      const d3 = component.d3;
      const stubbedD3 = new Proxy({}, {
        get(target, arg) {
          if (arg === 'event') {
            return {
              x: 250,
              y: 350
            };
          }
          return d3[arg];
        }
      }) as any as D3;
      component.d3 = stubbedD3;
      gravityPointDragStart.bind(component)(gp);
    });

    it('sets the coordinates of the gravity point start x and y', () => {
      expect(gp.sx).toEqual(250);
      expect(gp.sy).toEqual(350);
    });
  });

  describe('mouseUpOnGravityPoint', () => {
    it('attaches a a node to a gravity point', () => {
      component.tempLinkLine = {
        remove() {}
      } as any;
      const gp = {
        id: 'gp1',
        name: 'gp1 name',
        x: 100,
        y: 200,
      };
      component.tempLink = {
        association: 'secondLink',
        id: 'secondLink',
        source: 'thirdNode',
        target: '',
      } as Link;
      spyOn(stateServiceStubbed.twiglet, 'updateNodeParam');
      mouseUpOnGravityPoint.bind(component)(gp);
      expect(stateServiceStubbed.twiglet.updateNodeParam).toHaveBeenCalled();
    });

    it('does nothing if there is no templink', () => {
      const gp = {
        id: 'gp1',
        name: 'gp1 name',
        x: 100,
        y: 200,
      };
      component.tempLink = undefined;
      spyOn(stateServiceStubbed.twiglet, 'updateNodeParam');
      mouseUpOnGravityPoint.bind(component)(gp);
      expect(stateServiceStubbed.twiglet.updateNodeParam).not.toHaveBeenCalled();
    });
  });

  describe('gravityPointDragged', () => {
    let gp: GravityPoint;
    beforeEach(() => {
      gp = {
        id: 'gp1',
        name: 'gp1 Name',
        x: 100,
        y: 200,
      };
      const d3 = component.d3;
      const stubbedD3 = new Proxy({}, {
        get(target, arg) {
          if (arg === 'event') {
            return {
              x: 250,
              y: 350
            };
          }
          return d3[arg];
        }
      }) as any as D3;
      component.d3 = stubbedD3;
      spyOn(component, 'updateGravityPointLocation');
      gravityPointDragged.bind(component)(gp);
    });

    it('sets gravity point x to the mouse location', () => {
      expect(gp.x).toEqual(250);
    });

    it('updates the node fx and fy when dragged', () => {
      expect(component.updateGravityPointLocation).toHaveBeenCalled();
    });
  });

  describe('gravityPointDragEnded', () => {
    let gp: GravityPoint;
    describe('an actual drag', () => {
      beforeEach(() => {
        gp = {
          id: 'gp1',
          name: 'gp1 Name',
          sx: 105,
          sy: 210,
          x: 100,
          y: 200,
        };
        spyOn(stateServiceStubbed.twiglet.viewService, 'setGravityPoint');
        gravityPointDragEnded.bind(component)(gp);
      });

      it('updates the location of the gravity point when dragging is over', () => {
        expect(stateServiceStubbed.twiglet.viewService.setGravityPoint).toHaveBeenCalledWith(gp);
      });
    });

    describe('a click', () => {
      let componentInstance;
      beforeEach(() => {
        gp = {
          id: 'gp1',
          name: 'gp1 Name',
          sx: 105,
          sy: 210,
          x: 106,
          y: 209,
        };
        componentInstance = {};
      });

      it('does not open the modal if not in gravity mode', () => {
        stateServiceStubbed.userState.setAddGravityPoints(false);
        spyOn(component.modalService, 'open');
        stateServiceStubbed.userState.setGravityEditing(false);
        gravityPointDragEnded.bind(component)(gp);
        expect(component.modalService.open).not.toHaveBeenCalled();
      });

      it('does not open the modal if in add gravity point mode', () => {
        stateServiceStubbed.userState.setAddGravityPoints(true);
        spyOn(component.modalService, 'open');
        stateServiceStubbed.userState.setGravityEditing(true);
        gravityPointDragEnded.bind(component)(gp);
        expect(component.modalService.open).not.toHaveBeenCalled();
      });
    });
  });
});
