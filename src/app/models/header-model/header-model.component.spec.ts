import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { HeaderModelComponent } from './header-model.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { ChangelogListComponent } from './../../changelog-list/changelog-list.component';
import { StateService } from './../../state.service';
import { routerForTesting } from './../../app.router';
import { stateServiceStub, modelsList } from '../../../non-angular/testHelpers';
import { PrimitiveArraySortPipe } from './../../primitive-array-sort.pipe';
import { FormControlsSortPipe } from './../../form-controls-sort.pipe';

describe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let fixture: ComponentFixture<HeaderModelComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderModelComponent, ChangelogListComponent, ModelDropdownComponent, PrimitiveArraySortPipe ],
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
