import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EditModeButtonComponent } from './../../shared/edit-mode-button/edit-mode-button.component';
import { HeaderModelComponent } from './../header-model/header-model.component';
import { HeaderModelEditComponent } from './../header-model-edit/header-model-edit.component';
import { ModelDropdownComponent } from './../model-dropdown/model-dropdown.component';
import { ModelHomeComponent } from './model-home.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('ModelHomeComponent', () => {
  let component: ModelHomeComponent;
  let fixture: ComponentFixture<ModelHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditModeButtonComponent,
        HeaderModelComponent,
        HeaderModelEditComponent,
        ModelDropdownComponent,
        ModelHomeComponent
      ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStub() },
        { provide: Router, useValue: { url: '/model' } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
