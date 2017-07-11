import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';

import { SimulationControlsComponent } from './simulation-controls.component';
import { SliderWithLabelComponent } from '../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('SimulationControlsComponent', () => {
  let component: SimulationControlsComponent;
  let fixture: ComponentFixture<SimulationControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderWithLabelComponent, SimulationControlsComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationControlsComponent);
    component = fixture.componentInstance;
    component.userState = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
