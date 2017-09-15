/* tslint:disable:no-unused-variable */
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { ModelsModule } from './../models/models.module';
import { TwigletsModule } from './../twiglets/twiglets.module';
import { TwigletGraphComponent } from './../twiglets/twiglet-graph/twiglet-graph.component';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../non-angular/testHelpers';
import { RightSideBarComponent } from './right-side-bar.component';
import { StateService } from './../state.service';

describe('RightSideBarComponent', () => {
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
        { provide: StateService, useValue: stateServiceStubbed },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSideBarComponent);
    component = fixture.componentInstance;
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('router sets appropriate mode', () => {
    it('does not show the twiglets sidebar if there is no selected twiglet', () => {
      component.userState = fromJS({
        filters: {
          attributes: [],
          types: {}
        },
        mode: 'twiglet',
        sortNodesAscending: 'true',
        sortNodesBy: 'type',
        textToFilterOn: '',
      });
      component.twiglet = fromJS({
        name: null,
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-node-list')).toBeNull();
    });

    it('shows the twiglets sidebar if mode is twiglet and there is a selected twiglet', () => {
      component.userState = fromJS({
        filters: {
          attributes: [],
          types: {}
        },
        mode: 'twiglet',
        sortNodesAscending: 'true',
        sortNodesBy: 'type',
        textToFilterOn: '',
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-node-list')).toBeTruthy();
    });

    it('does not show the twiglets sidebar if the mode is not twiglet', () => {
      component.userState = fromJS({
        mode: 'model',
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-node-list')).toBeNull();
    });
  });
});
