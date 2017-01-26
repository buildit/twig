import { Model } from './../../non-angular/interfaces/model';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { testBedSetup } from './twiglet-graph.component.spec';

import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { getNodeImage, getColorFor, getRadius } from './nodeAttributesToDOMAttributes';

describe('TwigletGraphComponent:nodeAttributesToDOMAttributes', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  function node(): D3Node {
    return {
      id: 'id',
      name: 'a name',
      type: 'ent1',
    };
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });


  describe('getNodeImage', () => {
    it('returns the correct image if the Model.entity exists', () => {
      expect(getNodeImage.bind(component)(node())).toEqual('!');
    });

    it('warns to the console and returns an empty string if the entity does not exist', () => {
      const _node = node();
      _node.type = 'non-existant entity';
      spyOn(console, 'warn');
      expect(getNodeImage.bind(component)(_node)).toEqual('');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('getColorFor', () => {
    it('returns the correct color if the Model.entity exists', () => {
      expect(getColorFor.bind(component)(node())).toEqual('#bada55');
    });

    it('returns a default color and warns to the console if the entity does not exist', () => {
      const _node = node();
      _node.type = 'non-existant entity';
      spyOn(console, 'warn');
      expect(getColorFor.bind(component)(_node)).toEqual('#000000');
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
