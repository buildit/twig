import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, List } from 'immutable';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { HeaderModelComponent } from './../header-model/header-model.component';
import { ModelDropdownComponent } from './../model-dropdown/model-dropdown.component';
import { ModelFormComponent } from './../model-form/model-form.component';
import { ModelInfoComponent } from './../model-info/model-info.component';
import { ModelViewComponent } from './model-view.component';
import { StateService } from './../../state.service';
import { modelsList, stateServiceStub } from '../../../non-angular/testHelpers';

describe('ModelViewComponent', () => {
  let component: ModelViewComponent;
  let fixture: ComponentFixture<ModelViewComponent>;
  let stateServiceStubbed: StateService;

  const router = new BehaviorSubject({
    name: 'miniModel',
  });

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        FontAwesomeIconPickerComponent,
        HeaderModelComponent,
        ModelDropdownComponent,
        ModelFormComponent,
        ModelInfoComponent,
        ModelViewComponent,
      ],
      imports: [ DragulaModule, FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { params: router.asObservable() } },
        DragulaService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelViewComponent);
    component = fixture.componentInstance;
    component.models = List([]);
    component.userState = Map({
      isEditing: false,
      mode: 'model'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the model info when not editing', () => {
    expect(fixture.nativeElement.querySelector('app-model-info')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-model-form')).toBeNull();
  });
});
