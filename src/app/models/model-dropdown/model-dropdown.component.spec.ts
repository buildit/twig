import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModelDropdownComponent } from './model-dropdown.component';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('ModelDropdownComponent', () => {
  let component: ModelDropdownComponent;
  let fixture: ComponentFixture<ModelDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDropdownComponent, PrimitiveArraySortPipe ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStub() },
        { provide: Router, useValue: routerForTesting },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
