import { FilterImmutablePipe } from './../../shared/pipes/filter-immutable.pipe';
import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TwigletFiltersComponent } from './../twiglet-filters/twiglet-filters.component';
import { EventsListComponent } from './../events-list/events-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { fromJS, Map } from 'immutable';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

import { TwigletModeLeftBarComponent } from './twiglet-mode-left-bar.component';

describe('TwigletModeLeftBarComponent', () => {
  let component: TwigletModeLeftBarComponent;
  let fixture: ComponentFixture<TwigletModeLeftBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModeLeftBarComponent, TwigletFiltersComponent, EventsListComponent, TwigletFilterTargetComponent,
          FilterImmutablePipe ],
      imports: [ ReactiveFormsModule, NgbTooltipModule ],
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
