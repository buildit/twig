/* tslint:disable:no-unused-variable */
import { DebugElement, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';

import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../../shared/pipes/node-search.pipe';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { StateService } from './../../state.service';
import { TwigletNodeGroupComponent } from '../twiglet-node-group/twiglet-node-group.component';
import { TwigletNodeListComponent } from './twiglet-node-list.component';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('TwigletNodeListComponent', () => {
  let component: TwigletNodeListComponent;
  let fixture: ComponentFixture<TwigletNodeListComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    stateServiceStubbed.twiglet['_nodeTypes'].next(List(['ent1', 'ent2', 'ent3']));
    TestBed.configureTestingModule({
      declarations: [
        NodeInfoComponent,
        NodeSearchPipe,
        ObjectSortPipe,
        TwigletNodeGroupComponent,
        TwigletNodeListComponent,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        { provide: StateService, useValue: stateServiceStubbed },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletNodeListComponent);
    component = fixture.componentInstance;
    component.twigletModel = fullTwigletModelMap();
    component.userState = fromJS({
      currentNode: 'firstNode',
      filters: {
        attributes: [],
        types: {},
      },
      textToFilterOn: '',
    });
    component.twiglet = fullTwigletMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('handles when there is no current node', () => {
      component.userState = component.userState.delete(USERSTATE.CURRENT_NODE);
      component.ngOnInit();
      expect(component.userState.get(USERSTATE.CURRENT_NODE)).toEqual('');
    });

    it('does not affect the current node if it has been set', () => {
      component.userState = component.userState.set(USERSTATE.CURRENT_NODE, 'a node');
      component.ngOnInit();
      expect(component.userState.get(USERSTATE.CURRENT_NODE)).toEqual('a node');
    });
  });

  describe('ngOnChanges', () => {
    it('does nothing if the twiglet has not changed', () => {
      component.nodesArray = ['some nodes'];
      const twiglet = extraFullTwigletMap();
      const changes: SimpleChanges = {
        twiglet: {
          currentValue: twiglet,
          firstChange: false,
          isFirstChange: () => false,
          previousValue: twiglet,
        }
      }
      component.ngOnChanges(changes);
      expect(component.nodesArray).toEqual(['some nodes']);
    });

    it('updates the nodesArray with correct groups/info if the twiglet has changed', () => {
      const expectedNodesArray = [
        [
          { color: '#bada55', icon: 'bang', type: 'ent1' },
          [
            {
              attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
              id: 'firstNode',
              name: 'firstNodeName',
              radius: 10,
              type: 'ent1',
              x: 100,
              y: 100,
            },
            {
              attrs: [],
              id: 'fourthNode',
              name: 'fourthNodeName',
              radius: 10,
              type: 'ent1',
            }
          ]
        ],
        [
          { color: '#4286f4', icon: 'at', type: 'ent2' },
          [
            {
              attrs: [],
              id: 'secondNode',
              name: 'secondNodeName',
              radius: 10,
              type: 'ent2',
              x: 200,
              y: 300,
            }
          ]
        ],
        [
          { color: '#d142f4', icon: 'hashtag', type: 'ent3' },
          [
            {
              attrs: [],
              id: 'thirdNode',
              name: 'thirdNodeName',
              radius: 10,
              type: 'ent3',
            }
          ]
        ]
      ];
      component.nodesArray = ['some nodes'];
      component.twiglet = extraFullTwigletMap();
      const changes: SimpleChanges = {
        twiglet: {
          currentValue: extraFullTwigletMap(),
          firstChange: false,
          isFirstChange: () => false,
          previousValue: extraFullTwigletMap(),
        }
      }
      component.ngOnChanges(changes);
      expect(component.nodesArray).toEqual(expectedNodesArray);
    });
  });
});

function extraFullTwigletMap() {
  return fullTwigletMap().setIn(['nodes', 'fourthNode'], fromJS({
    attrs: [],
    id: 'fourthNode',
    name: 'fourthNodeName',
    radius: 10,
    type: 'ent1',
  }));
}
