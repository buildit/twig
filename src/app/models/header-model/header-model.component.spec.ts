import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { EditModeButtonComponent } from './../../shared/edit-mode-button/edit-mode-button.component';
import { HeaderModelComponent } from './header-model.component';
import { HeaderModelEditComponent } from './../header-model-edit/header-model-edit.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';

describe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let fixture: ComponentFixture<HeaderModelComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditModeButtonComponent,
        HeaderModelComponent,
        HeaderModelEditComponent,
        ModelDropdownComponent,
        PrimitiveArraySortPipe
      ],
      imports: [
         NgbModule.forRoot(),
      ],
      providers: [
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: routerForTesting }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderModelComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      formValid: true,
      isEditing: true,
    });
    component.models = modelsList();
    component.model = Map({
      changelog_url: 'modelurl/changelog',
      name: 'bsc',
      url: 'modelurl'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
