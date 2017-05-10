/* tslint:disable:no-unused-variable */
import { DebugElement, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { List, fromJS } from 'immutable';

import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { TwigletModelViewComponent } from './../twiglet-model-view/twiglet-model-view.component';
import { TwigletNodeGroupComponent } from '../twiglet-node-group/twiglet-node-group.component';
import { ModelsModule } from './../../models/models.module';
import { TwigletGraphComponent } from './../twiglet-graph/twiglet-graph.component';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
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
        TwigletNodeGroupComponent,
        NodeInfoComponent,
        TwigletGraphComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
      ],
      imports: [ NgbAccordionModule, SharedModule, CoreModule, ModelsModule ],
      providers: [
        NgbAccordionConfig,
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
});
