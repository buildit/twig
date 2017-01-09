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

import { keepNodeInBounds } from './locationHelpers';

describe('TwigletGraphComponent:locationHelpers', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

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
