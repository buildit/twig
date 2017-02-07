/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map } from 'immutable';

import { HeaderModelEditComponent } from './header-model-edit.component';
import { ModelEditButtonComponent } from './../model-edit-button/model-edit-button.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('HeaderModelEditComponent', () => {
  let component: HeaderModelEditComponent;
  let fixture: ComponentFixture<HeaderModelEditComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderModelEditComponent, ModelEditButtonComponent ],
      providers: [
        ToastsManager,
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderModelEditComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: true,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
