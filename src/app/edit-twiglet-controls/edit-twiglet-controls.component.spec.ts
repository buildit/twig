/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { StateService, StateServiceStub } from '../state.service';

import { EditTwigletControlsComponent } from './edit-twiglet-controls.component';

describe('EditTwigletControlsComponent', () => {
  let component: EditTwigletControlsComponent;
  let fixture: ComponentFixture<EditTwigletControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwigletControlsComponent ],
      imports: [ MaterialModule.forRoot() ],
      providers: [ { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwigletControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
