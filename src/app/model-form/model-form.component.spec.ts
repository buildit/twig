/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Map, fromJS} from 'immutable';
import { Observable, BehaviorSubject } from 'rxjs';

import { ModelFormComponent } from './model-form.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { FontAwesomeIconPickerComponent } from './../font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './../form-controls-sort.pipe';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';

fdescribe('ModelFormComponent', () => {
  let component: ModelFormComponent;
  let fixture: ComponentFixture<ModelFormComponent>;
  let stateServiceStubbed: StateService;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        ModelFormComponent,
        FormControlsSortPipe,
        FontAwesomeIconPickerComponent ],
      imports: [ ReactiveFormsModule, FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads the model', () => {
      stateServiceStubbed.model.loadModel('bsc');
      expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(14);
    });
  });
});
