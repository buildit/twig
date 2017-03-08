import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map, List } from 'immutable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SliderWithLabelComponent } from './../../slider-with-label/slider-with-label.component';
import { FontAwesomeToggleButtonComponent } from './../../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderViewComponent } from './header-view.component';
import { StateService } from './../../state.service';
import { stateServiceStub, fullTwigletModelMap } from '../../../non-angular/testHelpers';
import { SortImmutablePipe } from './../../sort-immutable.pipe';
import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';

describe('HeaderViewComponent', () => {
  let component: HeaderViewComponent;
  let fixture: ComponentFixture<HeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderViewComponent,
        FontAwesomeToggleButtonComponent,
        SliderWithLabelComponent,
        ViewDropdownComponent,
        SortImmutablePipe
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
    });
    component.views = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
