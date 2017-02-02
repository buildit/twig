import { Observable } from 'rxjs';
import { routerForTesting } from './../app.router';
import { ActivatedRoute } from '@angular/router';
import { StateService } from './../state.service';
import { FontAwesomeIconPickerComponent } from './../font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './../form-controls-sort.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { stateServiceStub } from '../../non-angular/testHelpers';

import { ModelViewComponent } from './model-view.component';

describe('ModelViewComponent', () => {
  let component: ModelViewComponent;
  let fixture: ComponentFixture<ModelViewComponent>;
  let stateServiceStubbed;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        ModelViewComponent,
        FormControlsSortPipe,
        FontAwesomeIconPickerComponent
      ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: Observable.of({id: 'id1'}) } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
