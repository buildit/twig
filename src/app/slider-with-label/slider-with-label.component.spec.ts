/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { SliderWithLabelComponent } from './slider-with-label.component';

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
