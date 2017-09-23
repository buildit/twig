import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, List, fromJS } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { GravityListComponent } from './../gravity-list/gravity-list.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { ToggleButtonComponent } from './../../shared/toggle-button/toggle-button.component';
import { TwigletViewsComponent } from './twiglet-views.component';
import { ViewListComponent } from './../view-list/view-list.component';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data'

describe('TwigletViewsComponent', () => {
  let component: TwigletViewsComponent;
  let fixture: ComponentFixture<TwigletViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GravityListComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TwigletViewsComponent,
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
    fixture = TestBed.createComponent(TwigletViewsComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      filterEntities: List([]),
      gravityPoints: Map({}),
    });
    component.views = Map({});
    component.viewData = fromJS({
      [VIEW_DATA.GRAVITY_POINTS]: {}
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Gravity List only shows up when editing gravity', () => {
    it('shows the gravity list when the user is editing gravity', () => {
      component.userState = component.userState.set(USERSTATE.IS_EDITING_GRAVITY, true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-gravity-list')).toBeTruthy();
    });

    it('does not show the gravity list when the user is not editing gravity', () => {
      component.userState = component.userState.set(USERSTATE.IS_EDITING_GRAVITY, false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-gravity-list')).toBeFalsy();
    });
  });
});
