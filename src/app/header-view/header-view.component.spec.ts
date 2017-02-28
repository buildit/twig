import { Map, List } from 'immutable';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SliderWithLabelComponent } from './../slider-with-label/slider-with-label.component';
import { FontAwesomeToggleButtonComponent } from './../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderViewComponent } from './header-view.component';
import { StateService } from './../state.service';
import { stateServiceStub, fullTwigletModelMap } from '../../non-angular/testHelpers';


describe('HeaderViewComponent', () => {
  let component: HeaderViewComponent;
  let fixture: ComponentFixture<HeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderViewComponent, FontAwesomeToggleButtonComponent, SliderWithLabelComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderViewComponent);
    component = fixture.componentInstance;
    component.twigletModel = fullTwigletModelMap();
    component.userState = Map({
      filterEntities: List([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
