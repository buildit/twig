/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SliderWithLabelComponent } from './slider-with-label.component';

describe('SliderWithLabelComponent', () => {
  let component: SliderWithLabelComponent;
  let fixture: ComponentFixture<SliderWithLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderWithLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderWithLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
