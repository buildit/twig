/* tslint:disable:no-unused-variable */
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { D3Node, Link } from '../../../non-angular/interfaces';
import { getColorFor, getNodeImage, getSizeFor } from './nodeAttributesToDOMAttributes';
import { Model } from './../../../non-angular/interfaces/model';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.updateNodes = () => undefined;

const testBedSetup = {
  declarations: [ TwigletGraphComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
    { provide: StateService, useValue: stateServiceStubbed },
    { provide: ToastsManager, useValue: mockToastr },
  ],
    ToastsManager,
};

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

  function overrideNode(): D3Node {
    return {
      _color: 'purple',
      _size: 50,
      id: 'id',
      name: 'a name',
      type: 'ent1'
    };
  };

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
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

    it('returns the override _color if that exists', () => {
      expect(getColorFor.bind(component)(overrideNode())).toEqual('purple');
    });
  });

  describe('getSizeFor', () => {
    it('returns the correct size if the Model.entity exists', () => {
      component.userState = fromJS({
        nodeSizingAutomatic: false
      });
      fixture.detectChanges();
      expect(getSizeFor.bind(component)(node())).toEqual(40);
    });

    it('returns the override _size if that exists', () => {
      expect(getSizeFor.bind(component)(overrideNode())).toEqual(50);
    });
  });
});
