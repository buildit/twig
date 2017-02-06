import { PrimitiveArraySortPipe } from './../primitive-array-sort.pipe';
import { Router } from '@angular/router';
import { routerForTesting } from './../app.router';
import { FormControlsSortPipe } from './../form-controls-sort.pipe';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderModelComponent } from './header-model.component';
import { ModelDropdownComponent } from '../model-dropdown/model-dropdown.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

fdescribe('HeaderModelComponent', () => {
  let component: HeaderModelComponent;
  let fixture: ComponentFixture<HeaderModelComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderModelComponent, ModelDropdownComponent, PrimitiveArraySortPipe ],
      imports: [
         NgbModule.forRoot(),
      ],
      providers: [
        NgbModal,
        ToastsManager,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: routerForTesting }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the current model when discard is clicked', () => {
    stateServiceStubbed.model.loadModel('bsc');
    fixture.detectChanges();
    spyOn(stateServiceStubbed.model, 'restoreBackup');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.model.restoreBackup).toHaveBeenCalled();
  });

  it('save button is disabled when form is invalid', () => {
    stateServiceStubbed.userState.setEditing(true);
    stateServiceStubbed.userState.setFormValid(false);
    fixture.detectChanges();
    spyOn(component, 'saveModel');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveModel).not.toHaveBeenCalled();
  });

  it('save button is not disabled when form is valid', () => {
    stateServiceStubbed.userState.setEditing(true);
    stateServiceStubbed.userState.setFormValid(true);
    fixture.detectChanges();
    spyOn(component, 'saveModel');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveModel).toHaveBeenCalled();
  });
});
