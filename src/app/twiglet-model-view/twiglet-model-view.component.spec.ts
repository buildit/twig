/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TwigletModelViewComponent } from './twiglet-model-view.component';
import { FontAwesomeIconPickerComponent } from './../font-awesome-icon-picker/font-awesome-icon-picker.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

fdescribe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModelViewComponent, FontAwesomeIconPickerComponent ],
      imports: [ ReactiveFormsModule, FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads the twiglet model', () => {
      // stateServiceStubbed.twiglet.
    })
  });
});
