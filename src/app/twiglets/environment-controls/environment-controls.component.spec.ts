import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

import { EnvironmentControlsComponent } from './environment-controls.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';

describe('EnvironmentControlsComponent', () => {
  let component: EnvironmentControlsComponent;
  let fixture: ComponentFixture<EnvironmentControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EnvironmentControlsComponent,
        SliderWithLabelComponent,
        ToggleButtonComponent,
      ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentControlsComponent);
    component = fixture.componentInstance;
    component.viewData = fromJS({});
    component.userState = fromJS({});
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
