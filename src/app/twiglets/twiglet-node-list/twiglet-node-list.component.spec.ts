/* tslint:disable:no-unused-variable */
import { DebugElement, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List } from 'immutable';

import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../../shared/pipes/node-search.pipe';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { StateService } from './../../state.service';
import { TwigletNodeGroupComponent } from '../twiglet-node-group/twiglet-node-group.component';
import { TwigletNodeListComponent } from './twiglet-node-list.component';

describe('TwigletNodeListComponent', () => {
  let component: TwigletNodeListComponent;
  let fixture: ComponentFixture<TwigletNodeListComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
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
});
