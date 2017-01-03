import { PageScrollService } from 'ng2-page-scroll';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbAccordionConfig, NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';

import { ImmutableMapOfMapsPipe } from './../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../node-search.pipe';
import { NodeSortPipe } from './../node-sort.pipe';
import { RightSideBarComponent } from './right-side-bar.component';
import { StateService, StateServiceStub } from './../state.service';

describe('RightSideBarComponent', () => {
  let component: RightSideBarComponent;
  let fixture: ComponentFixture<RightSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RightSideBarComponent,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent,
        NodeSearchPipe,
        NodeSortPipe,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        PageScrollService,
        { provide: StateService, useValue: new StateServiceStub()}
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
});
