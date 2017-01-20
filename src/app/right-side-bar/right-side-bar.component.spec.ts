import { PageScrollService } from 'ng2-page-scroll';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ImmutableMapOfMapsPipe } from './../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../node-search.pipe';
import { NodeSortPipe } from './../node-sort.pipe';
import { FilterEntitiesPipe } from './../filter-entities.pipe';
import { RightSideBarComponent } from './right-side-bar.component';
import { StateService, StateServiceStub } from './../state.service';

describe('RightSideBarComponent', () => {
  let component: RightSideBarComponent;
  let fixture: ComponentFixture<RightSideBarComponent>;
  const stateServiceStub = new StateServiceStub();
  const pageScrollService = new PageScrollService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RightSideBarComponent,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent,
        NodeSearchPipe,
        NodeSortPipe,
        FilterEntitiesPipe,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStub}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('scrollInsideActiveNode', () => {
    it('scrolls if there are nodes', () => {
      component.userState.currentNode = 'a node';
      spyOn(pageScrollService, 'start');
      component.scrollInsideToActiveNode();
      expect(pageScrollService.start).toHaveBeenCalled();
    });

    it('does not scroll if there are no nodes', () => {
      component.userState.currentNode = '';
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
      spyOn(stateServiceStub.userState, 'setCurrentNode');
      component.beforeChange($event);
      expect(stateServiceStub.userState.setCurrentNode).toHaveBeenCalledWith('an_id');
    });

    it('clears the current node if the event is anything other than the expanding of an accordion', () => {
      const $event = event();
      $event.nextState = false;
      spyOn(stateServiceStub.userState, 'clearCurrentNode');
      component.beforeChange($event);
      expect(stateServiceStub.userState.clearCurrentNode).toHaveBeenCalled();
    });
  });

});
