/* tslint:disable:no-unused-variable */
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageScrollService } from 'ng2-page-scroll';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Map, List } from 'immutable';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { fullTwigletMap, fullTwigletModelMap } from '../../non-angular/testHelpers';
import { FilterEntitiesPipe } from './../filter-entities.pipe';
import { ImmutableMapOfMapsPipe } from './../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../node-search.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';
import { RightSideBarComponent } from './right-side-bar.component';
import { stateServiceStub, pageScrollService } from '../../non-angular/testHelpers';
import { StateService } from './../state.service';
import { TwigletRightSideBarComponent } from './../twiglet-right-sidebar/twiglet-right-sidebar.component';

describe('RightSideBarComponent', () => {
  let compRef;
  let component: RightSideBarComponent;
  let fixture: ComponentFixture<RightSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterEntitiesPipe,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent,
        NodeSearchPipe,
        ObjectSortPipe,
        RightSideBarComponent,
        TwigletRightSideBarComponent,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStubbed },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSideBarComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('router sets appropriate mode', () => {
    it('shows the twiglets sidebar mode is twiglet', () => {
      component.userState = Map({
        currentNode: 'firstNode',
        filterEntities: List([]),
        mode: 'twiglet',
        sortNodesAscending: 'true',
        sortNodesBy: 'type',
        textToFilterOn: '',
      });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-right-sidebar')).toBeTruthy();
    });

    it('shows a placeholder for models when mode is model', () => {
      component.userState = Map({ mode: 'model' });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Model');
    });

    it('shows a placeholder for the home page the mode is home', () => {
      component.userState = Map({ mode: 'home' });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });
  });
});
