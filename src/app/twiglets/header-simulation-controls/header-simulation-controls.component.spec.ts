import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';

import { HeaderSimulationControlsComponent } from './header-simulation-controls.component';
import { SliderWithLabelComponent } from '../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

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
