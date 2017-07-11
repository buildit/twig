import { GravityListComponent } from './../twiglets/gravity-list/gravity-list.component';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { AddGravityPointToggleComponent } from './../twiglets/add-gravity-point-toggle/add-gravity-point-toggle.component';
import { EventsListComponent } from './../twiglets/events-list/events-list.component';
import { FilterImmutablePipe } from './../shared/pipes/filter-immutable.pipe';
import { HeaderEnvironmentComponent } from './../twiglets/header-environment/header-environment.component';
import { HeaderEventsComponent } from './../twiglets/header-events/header-events.component';
import { HeaderSimulationControlsComponent } from './../twiglets/header-simulation-controls/header-simulation-controls.component';
import { HeaderViewComponent } from './../twiglets/header-view/header-view.component';
import { LeftSideBarComponent } from './left-side-bar.component';
import { ModelDetailsComponent } from './../models/model-details/model-details.component';
import { ModelModeLeftBarComponent } from './../models/model-mode-left-bar/model-mode-left-bar.component';
import { SequenceDropdownComponent } from './../twiglets/sequence-dropdown/sequence-dropdown.component';
import { SliderWithLabelComponent } from './../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../shared/pipes/sort-immutable.pipe';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { ToggleButtonComponent } from './../shared/toggle-button/toggle-button.component';
import { TwigletDetailsComponent } from './../twiglets/twiglet-details/twiglet-details.component';
import { TwigletFiltersComponent } from './../twiglets/twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglets/twiglet-filter-target/twiglet-filter-target.component';
import { TwigletModeLeftBarComponent } from './../twiglets/twiglet-mode-left-bar/twiglet-mode-left-bar.component';
import { ViewListComponent } from './../twiglets/view-list/view-list.component';

describe('LeftSideBarComponent', () => {
  let component: LeftSideBarComponent;
  let fixture: ComponentFixture<LeftSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddGravityPointToggleComponent,
        EventsListComponent,
        FilterImmutablePipe,
        HeaderEnvironmentComponent,
        HeaderEventsComponent,
        HeaderSimulationControlsComponent,
        HeaderViewComponent,
        LeftSideBarComponent,
        ModelDetailsComponent,
        ModelModeLeftBarComponent,
        SequenceDropdownComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TwigletDetailsComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletModeLeftBarComponent,
        ViewListComponent,
        GravityListComponent
      ],
      imports: [
        FormsModule,
        NgbAccordionModule,
        ReactiveFormsModule,
        NgbTooltipModule
      ],
      providers: [
        NgbAccordionConfig,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: {
          firstChild: { params: Observable.of({name: 'name1'}) },
          params: Observable.of({name: 'name1'}),
        }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    it('shows the twiglet sidebar if the mode is twiglet', () => {
      component.userState = fromJS({
        mode: 'twiglet',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.twiglet-left')).toBeTruthy();
    });

    it('shows the model sidebar if the mode is model', () => {
      component.userState = fromJS({
        mode: 'model',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.model-left')).toBeTruthy();
    });
  });
});
