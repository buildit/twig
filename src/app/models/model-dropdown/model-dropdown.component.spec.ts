import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModelDropdownComponent } from './model-dropdown.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { routerForTesting } from './../../app.router';
import { PrimitiveArraySortPipe } from './../../primitive-array-sort.pipe';


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
