/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';
import { Router } from '@angular/router';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List } from 'immutable';
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
    it('shows the twiglets sidebar mode is twiglet', () => {
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

    it('shows a placeholder for models when mode is model', () => {
      component.userState = fromJS({ mode: 'model' });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Model');
    });

    it('shows a placeholder for the home page the mode is home', () => {
      component.userState = fromJS({ mode: 'home' });
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });
  });
});
