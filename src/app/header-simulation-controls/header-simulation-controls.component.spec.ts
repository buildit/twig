/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StateService, StateServiceStub } from '../state.service';
import { SliderWithLabelComponent } from '../slider-with-label/slider-with-label.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls.component';

describe('HeaderSimulationControlsComponent', () => {
  let component: HeaderSimulationControlsComponent;
  let fixture: ComponentFixture<HeaderSimulationControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderWithLabelComponent, HeaderSimulationControlsComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimulationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
