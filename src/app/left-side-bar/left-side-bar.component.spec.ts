import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { EventsListComponent } from './../twiglets/events-list/events-list.component';
import { FilterImmutablePipe } from './../shared/pipes/filter-immutable.pipe';
import { LeftSideBarComponent } from './left-side-bar.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { TwigletFiltersComponent } from './../twiglets/twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './../twiglets/twiglet-filter-target/twiglet-filter-target.component';
import { TwigletModeLeftBarComponent } from './../twiglets/twiglet-mode-left-bar/twiglet-mode-left-bar.component';

describe('LeftSideBarComponent', () => {
  let component: LeftSideBarComponent;
  let fixture: ComponentFixture<LeftSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LeftSideBarComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletModeLeftBarComponent,
        EventsListComponent,
        FilterImmutablePipe,
      ],
      imports: [ ReactiveFormsModule, NgbTooltipModule ],
      providers: [
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
    it('shows the twiglet filters if the mode is twiglet', () => {
      component.userState = fromJS({
        filters: {
          attributes: [],
          types: {},
        },
        mode: 'twiglet',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-twiglet-filters')).toBeTruthy();
    });
  });
});
