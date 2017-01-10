/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SliderWithLabelComponent } from './../slider-with-label/slider-with-label.component';
import { FontAwesomeToggleButtonComponent } from './../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderViewComponent } from './header-view.component';
import { StateService, StateServiceStub } from './../state.service';


describe('HeaderViewComponent', () => {
  let component: HeaderViewComponent;
  let fixture: ComponentFixture<HeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderViewComponent, FontAwesomeToggleButtonComponent, SliderWithLabelComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
