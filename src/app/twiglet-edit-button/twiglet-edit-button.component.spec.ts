import { Map } from 'immutable';
import { StateService } from './../state.service';
import { NgbModal, NgbTooltipConfig, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TwigletEditButtonComponent } from './twiglet-edit-button.component';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('TwigletEditButtonComponent', () => {
  let compRef;
  let component: TwigletEditButtonComponent;
  let fixture: ComponentFixture<TwigletEditButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletEditButtonComponent ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletEditButtonComponent);
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
});
