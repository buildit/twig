import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';

import { EnvironmentControlsComponent } from './environment-controls.component';
import { SliderWithLabelComponent } from './../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';

fdescribe('EnvironmentControlsComponent', () => {
  let component: EnvironmentControlsComponent;
  let fixture: ComponentFixture<EnvironmentControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentControlsComponent, SliderWithLabelComponent, ToggleButtonComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentControlsComponent);
    component = fixture.componentInstance;
    component.userState = Map({ });
    fixture.detectChanges();
  });

  it('should create', () => {
    component.userState = Map({ });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('not editing mode', () => {
    beforeEach(() => {
      component.userState = Map({ isEditing: false });
      fixture.detectChanges();
    });

    it('cascading collapse is available', () => {
      expect(fixture.nativeElement.querySelector('.set-cascading-collapse')).toBeTruthy();
    });

    it('tree mode is available', () => {
      expect(fixture.nativeElement.querySelector('.set-tree-mode')).toBeTruthy();
    });

    it('auto connectivity is available', () => {
      expect(fixture.nativeElement.querySelector('.set-auto-connectivity')).toBeTruthy();
    });

    it('scale is available', () => {
      expect(fixture.nativeElement.querySelector('.set-scale')).toBeTruthy();
    });
  });

  describe('editing mode', () => {
    beforeEach(() => {
      component.userState = Map({ isEditing: true });
      fixture.detectChanges();
    });

    it('cascading collapse is available', () => {
      expect(fixture.nativeElement.querySelector('.set-cascading-collapse')).toBeFalsy();
    });

    it('tree mode is available', () => {
      expect(fixture.nativeElement.querySelector('.set-tree-mode')).toBeFalsy();
    });

    it('auto connectivity is available', () => {
      expect(fixture.nativeElement.querySelector('.set-auto-connectivity')).toBeFalsy();
    });

    it('scale is available', () => {
      expect(fixture.nativeElement.querySelector('.set-scale')).toBeFalsy();
    });
  });
});
