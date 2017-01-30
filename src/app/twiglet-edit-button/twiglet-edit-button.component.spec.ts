import { StateService } from './../state.service';
import { NgbModal, NgbTooltipConfig, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TwigletEditButtonComponent } from './twiglet-edit-button.component';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('TwigletEditButtonComponent', () => {
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display save and discard buttons when user is editing', () => {
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
  });

  it('should not display save and discard buttons if user is not editing', () => {
    stateServiceStubbed.userState.setEditing(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
  });

  it('should load the current twiglet when discard changes is clicked', () => {
    stateServiceStubbed.userState.setCurrentTwigletId('id1');
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'restoreBackup');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.twiglet.restoreBackup).toHaveBeenCalled();
  });
});
