/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StateService, StateServiceStub } from '../state.service';

import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button.component';

describe('FontAwesomeToggleButtonComponent', () => {
  let component: FontAwesomeToggleButtonComponent;
  let fixture: ComponentFixture<FontAwesomeToggleButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontAwesomeToggleButtonComponent ],
      providers: [ { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontAwesomeToggleButtonComponent);
    component = fixture.componentInstance;
    component.icon = 'usd';
    component.checkedString = 'userState/isEditing';
    component.actionString = 'userState.setShowNodeLabels';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
