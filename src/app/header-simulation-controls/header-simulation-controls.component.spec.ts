import { Map } from 'immutable';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { SliderWithLabelComponent } from '../slider-with-label/slider-with-label.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls.component';

describe('HeaderSimulationControlsComponent', () => {
  let component: HeaderSimulationControlsComponent;
  let fixture: ComponentFixture<HeaderSimulationControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderWithLabelComponent, HeaderSimulationControlsComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimulationControlsComponent);
    component = fixture.componentInstance;
    component.userState = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
