/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ToggleButtonComponent } from './toggle-button.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('ToggleButtonComponent', () => {
  let component: ToggleButtonComponent;
  let fixture: ComponentFixture<ToggleButtonComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ToggleButtonComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleButtonComponent);
    component = fixture.componentInstance;
    component.actionString = 'userState.setShowNodeLabels';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('it has a special mode for linkType', () => {
    beforeEach(() => {
      component.label = 'linkType';
      component.actionString = 'userState.setLinkType';
      spyOn(stateServiceStubbed.userState, 'setLinkType');
      component.ngOnInit();
    });

    it('sets linkType to line on true', () => {
      component.action(true);
      expect(stateServiceStubbed.userState.setLinkType).toHaveBeenCalledWith('line');
    });

    it('sets linkType to path on false', () => {
      component.action(false);
      expect(stateServiceStubbed.userState.setLinkType).toHaveBeenCalledWith('path');
    });
  });

  describe('everything else just gets true and false passed to it', () => {
    beforeEach(() => {
      component.label = 'autoScale';
      component.actionString = 'userState.setAutoScale';
      spyOn(stateServiceStubbed.userState, 'setAutoScale');
      component.ngOnInit();
    });

    it('sets notLink to line on true', () => {
      component.action(true);
      expect(stateServiceStubbed.userState.setAutoScale).toHaveBeenCalledWith(true);
    });

    it('sets linkType to path on false', () => {
      component.action(false);
      expect(stateServiceStubbed.userState.setAutoScale).toHaveBeenCalledWith(false);
    });
  });
});
