/* tslint:disable:no-unused-variable */
import { DebugElement, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { List, fromJS } from 'immutable';
import { PageScrollService } from 'ng2-page-scroll';

import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { TwigletModelViewComponent } from './../twiglet-model-view/twiglet-model-view.component';
import { ModelsModule } from './../../models/models.module';
import { TwigletGraphComponent } from './../twiglet-graph/twiglet-graph.component';
import { fullTwigletMap, fullTwigletModelMap, pageScrollService, stateServiceStub } from '../../../non-angular/testHelpers';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { StateService } from './../../state.service';
import { TwigletNodeListComponent } from './twiglet-node-list.component';

describe('TwigletNodeListComponent', () => {
  let component: TwigletNodeListComponent;
  let fixture: ComponentFixture<TwigletNodeListComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NodeInfoComponent,
        TwigletGraphComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
      ],
      imports: [ NgbAccordionModule, SharedModule, CoreModule, ModelsModule ],
      providers: [
        NgbAccordionConfig,
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: APP_BASE_HREF, useValue: '/' },
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

    it('displays the types', () => {
      const $event = event();
      component.ngOnChanges($event);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.type').length).toEqual(3);
    });

    it('displays the count of nodes per type', () => {
      const $event = event();
      component.ngOnChanges($event);
      expect(component.types[0].nodesLength).toEqual(1);
    });

    it('does not display nodes initially', () => {
      component.userState = component.userState.set('currentNode', '');
      const $event = event();
      component.ngOnChanges($event);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.node').length).toEqual(0);
    });

    it('displays nodes for selected types', () => {
      component.typesShown = ['ent1', 'ent2'];
      const $event = event();
      component.ngOnChanges($event);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.node').length).toEqual(2);
    });
  });
});
