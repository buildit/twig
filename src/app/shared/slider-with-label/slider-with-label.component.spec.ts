/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SliderWithLabelComponent } from './slider-with-label.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('SliderWithLabelComponent', () => {
  let component: SliderWithLabelComponent;
  let fixture: ComponentFixture<SliderWithLabelComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ SliderWithLabelComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(stateServiceStubbed.twiglet.viewService, 'setScale');
    fixture = TestBed.createComponent(SliderWithLabelComponent);
    component = fixture.componentInstance;
    component.valueString = 'twiglet/viewService/data/scale';
    component.actionString = 'twiglet.viewService.setScale';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the right stateService action', () => {
    component.action(10);
    expect(stateServiceStubbed.twiglet.viewService.setScale).toHaveBeenCalledWith(10);
  });
});
