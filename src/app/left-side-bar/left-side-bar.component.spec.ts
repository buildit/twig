import { DismissibleHelpDialogComponent } from './../shared/dismissible-help-dialog/dismissible-help-dialog.component';
import { DismissibleHelpModule } from './../directives/dismissible-help/dismissible-help.module';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { EnvironmentControlsComponent } from './../twiglets/environment-controls/environment-controls.component';
import { EventsListComponent } from './../twiglets/events-list/events-list.component';
import { FilterImmutablePipe } from './../shared/pipes/filter-immutable.pipe';
import { GravityListComponent } from './../twiglets/gravity-list/gravity-list.component';
import { LeftSideBarComponent } from './left-side-bar.component';
import { ModelDetailsComponent } from './../models/model-details/model-details.component';
import { ModelModeLeftBarComponent } from './../models/model-mode-left-bar/model-mode-left-bar.component';
import { SequenceListComponent } from './../twiglets/sequence-list/sequence-list.component';
import { SimulationControlsComponent } from './../twiglets/simulation-controls/simulation-controls.component';
import { SliderWithLabelComponent } from './../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../shared/pipes/sort-immutable.pipe';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { ToggleButtonComponent } from './../shared/toggle-button/toggle-button.component';
import { TwigletDetailsComponent } from './../twiglets/twiglet-details/twiglet-details.component';
import { TwigletEventsComponent } from './../twiglets/twiglet-events/twiglet-events.component';
import { TwigletFiltersComponent } from './../twiglets/twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglets/twiglet-filter-target/twiglet-filter-target.component';
import { TwigletGravityComponent } from './../twiglets/twiglet-gravity/twiglet-gravity.component';
import { TwigletModeLeftBarComponent } from './../twiglets/twiglet-mode-left-bar/twiglet-mode-left-bar.component';

describe('LeftSideBarComponent', () => {
  let component: LeftSideBarComponent;
  let fixture: ComponentFixture<LeftSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DismissibleHelpDialogComponent,
        EnvironmentControlsComponent,
        EventsListComponent,
        FilterImmutablePipe,
        GravityListComponent,
        LeftSideBarComponent,
        ModelDetailsComponent,
        ModelModeLeftBarComponent,
        SequenceListComponent,
        SliderWithLabelComponent,
        SimulationControlsComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TwigletDetailsComponent,
        TwigletEventsComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletGravityComponent,
        TwigletModeLeftBarComponent,
      ],
      imports: [
        FormsModule,
        NgbAccordionModule,
        NgbTooltipModule,
        ReactiveFormsModule,
        DismissibleHelpModule,
      ],
      providers: [
        NgbAccordionConfig,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: {
          firstChild: { params: Observable.of({ name: 'name1' }) },
          params: Observable.of({ name: 'name1' }),
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
