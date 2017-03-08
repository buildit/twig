import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { EditModeButtonComponent } from './../../edit-mode-button/edit-mode-button.component';
import { EditModelDetailsComponent } from './../edit-model-details/edit-model-details.component';
import { fullModelMap, modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { HeaderModelEditComponent } from './header-model-edit.component';
import { StateService } from './../../state.service';

describe('HeaderModelEditComponent', () => {
  let component: HeaderModelEditComponent;
  let fixture: ComponentFixture<HeaderModelEditComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditModeButtonComponent,
        EditModelDetailsComponent,
        HeaderModelEditComponent,
      ],
      imports: [
        NgbTooltipModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        ToastsManager,
        ToastOptions,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
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
    component.models = modelsList();
    component.model = fullModelMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
