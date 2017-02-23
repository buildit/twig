import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Map } from 'immutable';
import { NgbModal, NgbTooltipConfig, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { EditModeButtonComponent } from './edit-mode-button.component';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { StateService } from './../state.service';

fdescribe('EditModeButtonComponent', () => {
  let compRef;
  let component: EditModeButtonComponent;
  let fixture: ComponentFixture<EditModeButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModeButtonComponent ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeButtonComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: true,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the save button when user is editing', () => {
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
  });

  it('should display the discard button when the user is editing', () => {
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
  });

  it('should not display save button if user is not editing', () => {
    stateServiceStubbed.userState.setEditing(false);
    component.userState = Map({
      isEditing: false,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
  });

  it('should not display discard button if user is not editing', () => {
    stateServiceStubbed.userState.setEditing(false);
    component.userState = Map({
      isEditing: false,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
  });

  it('should load the current twiglet when discard changes is clicked', () => {
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'restoreBackup');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.twiglet.restoreBackup).toHaveBeenCalled();
  });

  it('save button is disabled when form is invalid', () => {
    component.userState = Map({
      formValid: false,
      isEditing: true,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    spyOn(component, 'saveTwiglet');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveTwiglet).not.toHaveBeenCalled();
  });

  it('save button is not disabled when form is valid', () => {
    component.userState = Map({
      formValid: true,
      isEditing: true,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    spyOn(component, 'saveTwiglet');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveTwiglet).toHaveBeenCalled();
  });

  it('submits changes to a twiglet model when save is clicked', () => {
    component.userState = Map({
      editTwigletModel: true,
      formValid: true,
      isEditing: true,
    });
    compRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue({ subscribe: () => {} });
    component.saveTwigletModel();
    expect(stateServiceStubbed.twiglet.modelService.saveChanges).toHaveBeenCalled();
  });
});
