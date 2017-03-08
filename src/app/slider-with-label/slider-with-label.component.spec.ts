/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SliderWithLabelComponent } from './slider-with-label.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('SliderWithLabelComponent', () => {
  let component: SliderWithLabelComponent;
  let fixture: ComponentFixture<SliderWithLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderWithLabelComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStub() }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderWithLabelComponent);
    component = fixture.componentInstance;
    component.valueString = 'userState/forceLinkStrength';
    component.actionString = 'userState.setforceLinkStrength';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
