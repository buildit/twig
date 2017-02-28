/* tslint:disable:no-unused-variable */
import { PageScrollService } from 'ng2-page-scroll';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChanges } from '@angular/core';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { List, fromJS } from 'immutable';

import { ImmutableMapOfMapsPipe } from './../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../node-search.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';
import { FilterNodesPipe } from './../filter-nodes.pipe';
import { TwigletRightSideBarComponent } from './twiglet-right-sidebar.component';
import { StateService } from './../state.service';
import { stateServiceStub, pageScrollService, fullTwigletModelMap, fullTwigletMap } from '../../non-angular/testHelpers';

fdescribe('TwigletRightSidebarComponent', () => {
  let component: TwigletRightSideBarComponent;
  let fixture: ComponentFixture<TwigletRightSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TwigletRightSideBarComponent,
        FilterNodesPipe,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent,
        NodeSearchPipe,
        ObjectSortPipe,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStubbed }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletRightSideBarComponent);
    component = fixture.componentInstance;
    component.twigletModel = fullTwigletModelMap();
    component.userState = fromJS({
      currentNode: 'firstNode',
      filters: {
        attributes: [],
        types: {},
      },
      sortNodesAscending: 'true',
      sortNodesBy: 'type',
      textToFilterOn: '',
    });
    component.twiglet = fullTwigletMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('scrollInsideActiveNode', () => {
    it('scrolls if there are nodes', () => {
      component.userState = component.userState.set('currentNode', 'firstNode');
      spyOn(pageScrollService, 'start');
      component.scrollInsideToActiveNode();
      expect(pageScrollService.start).toHaveBeenCalled();
    });

    it('does not scroll if there are no nodes', () => {
      component.userState = component.userState.set('currentNode', '');
      spyOn(pageScrollService, 'start');
      component.scrollInsideToActiveNode();
      expect(pageScrollService.start).not.toHaveBeenCalled();
    });
  });

  describe('beforeChange', () => {
    function event(): NgbPanelChangeEvent {
      return { panelId: 'an_id', nextState: true } as any as NgbPanelChangeEvent;
    }
    it('sets the current node if the event is the expanding of a node', () => {
      const $event = event();
      spyOn(stateServiceStubbed.userState, 'setCurrentNode');
      component.beforeChange($event);
      expect(stateServiceStubbed.userState.setCurrentNode).toHaveBeenCalledWith('an_id');
    });

    it('clears the current node if the event is anything other than the expanding of an accordion', () => {
      const $event = event();
      $event.nextState = false;
      spyOn(stateServiceStubbed.userState, 'clearCurrentNode');
      component.beforeChange($event);
      expect(stateServiceStubbed.userState.clearCurrentNode).toHaveBeenCalled();
    });
  });

  describe('onChanges', () => {
    function event(): SimpleChanges {
      return { twiglet: component.twiglet } as any as SimpleChanges;
    }

    it('sets the visible types', () => {
      const $event = event();
      component.ngOnChanges($event);
      expect(component.types.length).toEqual(3);
    });
  });
});
