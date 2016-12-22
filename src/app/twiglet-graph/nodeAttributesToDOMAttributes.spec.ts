/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';

import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { getNodeImage, getColorFor, getRadius } from './nodeAttributesToDOMAttributes';

describe('TwigletGraphComponent:nodeAttributesToDOMAttributes', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  const node: D3Node = {
    id: 'id',
    name: 'a name',
    type: '#',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletGraphComponent ],
      providers: [ D3Service, { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  xit('returns the correct image for a node based on the loaded model', () => {

  });

  xit('returns the correct color a node based on the loaded model', () => {

  });

  xit('returns the correct radius for a node based on the loaded model and user options', () => {

  });
});
