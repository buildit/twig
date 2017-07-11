import { GravityListComponent } from './../gravity-list/gravity-list.component';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, List } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AddGravityPointToggleComponent } from './../add-gravity-point-toggle/add-gravity-point-toggle.component';
import { ToggleButtonComponent } from './../../shared/toggle-button/toggle-button.component';
import { fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { HeaderViewComponent } from './header-view.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { ViewListComponent } from './../view-list/view-list.component';

describe('HeaderViewComponent', () => {
  let component: HeaderViewComponent;
  let fixture: ComponentFixture<HeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddGravityPointToggleComponent,
        HeaderViewComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        GravityListComponent,
      ViewListComponent,
      ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        ToastsManager
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderViewComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      filterEntities: List([]),
      gravityPoints: Map({}),
    });
    component.views = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
