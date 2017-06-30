import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';

import { HeaderEnvironmentComponent } from './header-environment.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';

describe('HeaderEnvironmentComponent', () => {
  let component: HeaderEnvironmentComponent;
  let fixture: ComponentFixture<HeaderEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderEnvironmentComponent, SliderWithLabelComponent, ToggleButtonComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEnvironmentComponent);
    component = fixture.componentInstance;
    component.userState = Map({ });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
