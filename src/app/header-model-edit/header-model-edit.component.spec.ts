import { ReactiveFormsModule } from '@angular/forms';
import { EditModeButtonComponent } from './../edit-mode-button/edit-mode-button.component';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map } from 'immutable';
import { NgbModal, NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { EditModelDetailsComponent } from './../edit-model-details/edit-model-details.component';
import { HeaderModelEditComponent } from './header-model-edit.component';
import { ModelEditButtonComponent } from './../model-edit-button/model-edit-button.component';
import { StateService } from './../state.service';
import { stateServiceStub, modelsList, fullModelMap } from '../../non-angular/testHelpers';

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
        ModelEditButtonComponent
      ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ReactiveFormsModule ],
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
    component.models = modelsList();
    component.model = fullModelMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
