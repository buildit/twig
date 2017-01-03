import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StateService, StateServiceStub } from '../state.service';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button.component';

describe('AddNodeByDraggingButtonComponent', () => {
  let component: AddNodeByDraggingButtonComponent;
  let fixture: ComponentFixture<AddNodeByDraggingButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodeByDraggingButtonComponent ],
      imports: [ NgbTooltipModule ],
      providers: [ NgbTooltipConfig, { provide: StateService, useValue: new StateServiceStub()} ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodeByDraggingButtonComponent);
    component = fixture.componentInstance;
    component.entity = {
      key: 'ent1',
      value: {
        class: 'bang',
        color: '#000000',
        image: '!',
        size: 10,
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
