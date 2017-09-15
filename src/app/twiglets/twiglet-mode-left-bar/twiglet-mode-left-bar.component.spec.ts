import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { EnvironmentControlsComponent } from './../environment-controls/environment-controls.component';
import { EventsListComponent } from './../events-list/events-list.component';
import { FilterImmutablePipe } from './../../shared/pipes/filter-immutable.pipe';
import { GravityListComponent } from './../gravity-list/gravity-list.component';
import { SequenceListComponent } from './../sequence-list/sequence-list.component';
import { SimulationControlsComponent } from './../simulation-controls/simulation-controls.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from './../../shared/toggle-button/toggle-button.component';
import { TwigletDetailsComponent } from './../twiglet-details/twiglet-details.component';
import { TwigletEventsComponent } from './../twiglet-events/twiglet-events.component';
import { TwigletFiltersComponent } from './../twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';
import { TwigletModeLeftBarComponent } from './twiglet-mode-left-bar.component';
import { TwigletViewsComponent } from './../twiglet-views/twiglet-views.component';
import { ViewListComponent } from './../view-list/view-list.component';

describe('TwigletModeLeftBarComponent', () => {
  let component: TwigletModeLeftBarComponent;
  let fixture: ComponentFixture<TwigletModeLeftBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EnvironmentControlsComponent,
        EventsListComponent,
        FilterImmutablePipe,
        GravityListComponent,
        SequenceListComponent,
        SimulationControlsComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TwigletDetailsComponent,
        TwigletEventsComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletModeLeftBarComponent,
        TwigletViewsComponent,
        ViewListComponent,
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
      filters: {
        attributes: [],
        types: {},
      },
      gravityPoints: {},
      isEditing: false,
    });
    component.twiglet = fromJS({
      nodes: [],
    });
    component.eventsList = fromJS({});

  });

  it('should create', () => {
    component.userState = fromJS({
      filters: {
        attributes: [],
        types: {},
      },
      gravityPoints: {},
      isEditing: false,
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('render', () => {
    describe('twiglet selected', () => {
      it('does not display the accordion if no twiglet is selected', () => {
        expect(fixture.nativeElement.querySelector('ngb-accordion')).toBeNull();
      });

      it('does display the accordion when a twiglet is selected', () => {
        component.twiglet = fromJS({
          name: 'name',
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('ngb-accordion')).toBeTruthy();
      });
    });

    describe('editing mode', () => {
      describe('not editing', () => {
        let headerTitles = [];
        beforeEach(() => {
          component.userState = fromJS({
            filters: {
              attributes: [],
              types: {},
            },
            gravityPoints: {},
            isEditing: false,
          });
          component.twiglet = fromJS({
            name: 'name',
            nodes: [],
          });
          fixture.detectChanges();
          const cardHeaders = <NodeListOf<HTMLAnchorElement>>fixture.nativeElement.querySelectorAll('.card-header a');
          headerTitles = Array.from(cardHeaders).map(el => el.innerText);
        })

        it('shows the twiglet views panel', () => {
          expect(headerTitles).toContain('View');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).toContain('Simulation');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).toContain('Events');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).toContain('Details');
        });
      });

      describe('editing', () => {
        let headerTitles = [];
        beforeEach(() => {
          component.userState = fromJS({
            filters: {
              attributes: [],
              types: {},
            },
            gravityPoints: {},
            isEditing: true,
          });
          component.twiglet = fromJS({
            name: 'name',
            nodes: [],
          });
          fixture.detectChanges();
          const cardHeaders = <NodeListOf<HTMLAnchorElement>>fixture.nativeElement.querySelectorAll('.card-header a');
          headerTitles = Array.from(cardHeaders).map(el => el.innerText);
        })

        it('shows the twiglet views panel', () => {
          expect(headerTitles).not.toContain('View');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).not.toContain('Simulation');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).not.toContain('Events');
        });

        it('shows the twiglet views panel', () => {
          expect(headerTitles).not.toContain('Details');
        });
      });
    });
  })
});
