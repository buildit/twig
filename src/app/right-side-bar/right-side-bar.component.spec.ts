/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';
import { Router } from '@angular/router';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List } from 'immutable';
import { PageScrollService } from 'ng2-page-scroll';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';

import { ModelsModule } from './../models/models.module';
import { TwigletsModule } from './../twiglets/twiglets.module';
import { TwigletGraphComponent } from './../twiglets/twiglet-graph/twiglet-graph.component';
import { fullTwigletMap, fullTwigletModelMap, pageScrollService, stateServiceStub } from '../../non-angular/testHelpers';
import { RightSideBarComponent } from './right-side-bar.component';
import { StateService } from './../state.service';

describe('RightSideBarComponent', () => {
  let compRef;
  let component: RightSideBarComponent;
  let fixture: ComponentFixture<RightSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RightSideBarComponent,
      ],
      imports: [ NgbAccordionModule, SharedModule, CoreModule, TwigletsModule, ModelsModule ],
      providers: [
        NgbAccordionConfig,
        { provide: APP_BASE_HREF, useValue: '/' },
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
      component.userState = fromJS({
        currentNode: 'firstNode',
        filters: {
          attributes: [],
          types: {}
        },
        mode: 'twiglet',
        sortNodesAscending: 'true',
        sortNodesBy: 'type',
        textToFilterOn: '',
      });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-node-list')).toBeTruthy();
    });

    it('shows a placeholder for models when mode is model', () => {
      component.userState = fromJS({ mode: 'model' });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Model');
    });

    it('shows a placeholder for the home page the mode is home', () => {
      component.userState = fromJS({ mode: 'home' });
      compRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });
  });
});
