import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { AddGravityPointToggleComponent } from './../add-gravity-point-toggle/add-gravity-point-toggle.component';
import { EventsListComponent } from './../events-list/events-list.component';
import { FilterImmutablePipe } from './../../shared/pipes/filter-immutable.pipe';
import { HeaderEnvironmentComponent } from './../header-environment/header-environment.component';
import { HeaderEventsComponent } from './../header-events/header-events.component';
import { HeaderSimulationControlsComponent } from './../header-simulation-controls/header-simulation-controls.component';
import { HeaderViewComponent } from './../header-view/header-view.component';
import { SequenceDropdownComponent } from './../sequence-dropdown/sequence-dropdown.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from './../../shared/toggle-button/toggle-button.component';
import { TwigletDetailsComponent } from './../twiglet-details/twiglet-details.component';
import { TwigletFiltersComponent } from './../twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';
import { TwigletModeLeftBarComponent } from './twiglet-mode-left-bar.component';
import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';

describe('TwigletModeLeftBarComponent', () => {
  let component: TwigletModeLeftBarComponent;
  let fixture: ComponentFixture<TwigletModeLeftBarComponent>;
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
        SequenceDropdownComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TwigletDetailsComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletModeLeftBarComponent,
        ViewDropdownComponent,
      ],
      imports: [ FormsModule, ReactiveFormsModule, NgbTooltipModule, NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: {
            firstChild: { params: Observable.of({name: 'name1'}) },
            params: Observable.of({name: 'name1'}),
          }
        },
        NgbTooltipConfig,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModeLeftBarComponent);
    component = fixture.componentInstance;
    component.userState = fromJS({
      activeTab: 'twiglet',
      filters: {
        attributes: [],
        types: {},
      }
    });
    component.twiglet = fromJS({
      nodes: [],
    });
    component.eventsList = fromJS({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
