/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';

import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { keepNodeInBounds } from './locationHelpers';

describe('TwigletGraphComponent:locationHelpers', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

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
        x: 200,
        y: 300,
      };
      keepNodeInBounds.bind(component)(node);
      expect(node.x).toEqual(200);
      expect(node.y).toEqual(300);
    });

    it('fixes the node if the view is editing.', () => {
      const node: D3Node = {
        id: 'noCoordinates',
      };
      component.userState.isEditing = true;
      keepNodeInBounds.bind(component)(node);
      expect(node.fx).toEqual(node.x);
      expect(node.fy).toEqual(node.y);
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
