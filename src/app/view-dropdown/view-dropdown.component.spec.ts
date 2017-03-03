import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../state.service';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NgModule } from '@angular/core';

import { stateServiceStub } from '../../non-angular/testHelpers';
import { ViewDropdownComponent } from './view-dropdown.component';

describe('ViewDropdownComponent', () => {
  let component: ViewDropdownComponent;
  let fixture: ComponentFixture<ViewDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDropdownComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [{ provide: StateService, useValue: stateServiceStub() }, NgbModal],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
