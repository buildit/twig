/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
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
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { keepNodeInBounds } from './locationHelpers';
import { LoadingSpinnerComponent } from './../../shared/loading-spinner/loading-spinner.component';
import { StateService } from './../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { testBedSetup } from './twiglet-graph.component.spec';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './twiglet-graph.component';

describe('TwigletGraphComponent:locationHelpers', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('keepNodeInBounds', () => {
    it('assigns a value to x and y if they are not already assigned', () => {
      const node: D3Node = {
        id: 'noCoordinates',
      };
      keepNodeInBounds.bind(component)(node);
      expect(node.x).toBeTruthy();
      expect(node.y).toBeTruthy();
    });

    it('does not override x and y if they are already assigned', () => {
      const node: D3Node = {
        id: 'noCoordinates',
        x: 50,
        y: 100,
      };
      keepNodeInBounds.bind(component)(node);
      expect(node.x).toEqual(50);
      expect(node.y).toEqual(100);
    });

    it('keeps the nodes from moving off screen towards the negatives', () => {
      stateServiceStubbed.twiglet.viewService.setAutoConnectivity('out');
      const node: D3Node = {
        id: 'noCoordinates',
        x: -100,
        y: -150,
      };
      keepNodeInBounds.bind(component)(node);
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeGreaterThanOrEqual(0);
    });

    it('keeps the nodes from moving off screen towards the positives', () => {
      stateServiceStubbed.twiglet.viewService.setAutoConnectivity('both');
      const node: D3Node = {
        id: 'noCoordinates',
        x: 10000,
        y: 15000,
      };
      keepNodeInBounds.bind(component)(node);
      expect(node.x).toBeLessThanOrEqual(3000);
      expect(node.y).toBeLessThanOrEqual(3000);
    });
  });
});
