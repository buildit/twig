import { ToggleButtonComponent } from './../../shared/toggle-button/toggle-button.component';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

import { SimulationControlsComponent } from './simulation-controls.component';
import { SliderWithLabelComponent } from '../../shared/slider-with-label/slider-with-label.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('SimulationControlsComponent', () => {
  let component: SimulationControlsComponent;
  let fixture: ComponentFixture<SimulationControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationControlsComponent, SliderWithLabelComponent, ToggleButtonComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationControlsComponent);
    component = fixture.componentInstance;
    component.viewData = fromJS({});
  });

  it('should create', () => {
    component.userState = fromJS({});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('enables the controls if there is no view loaded', () => {
    component.userState = fromJS({});
    fixture.detectChanges();
    const slider = <HTMLElement>fixture.nativeElement.querySelector('app-slider-with-label');
    expect(slider.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false');
  });

  it('disables the controls if there is a view loaded', () => {
    component.userState = fromJS({
      [USERSTATE.CURRENT_VIEW_NAME]: 'a view'
    });
    fixture.detectChanges();
    const slider = <HTMLElement>fixture.nativeElement.querySelector('app-slider-with-label');
    expect(slider.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('true');
  });

  it('enables the controls if there is a view loaded but the user is in edit mode', () => {
    component.userState = fromJS({
      [USERSTATE.CURRENT_VIEW_NAME]: 'a view',
      [USERSTATE.IS_EDITING_VIEW]: true,
    });
    fixture.detectChanges();
    const slider = <HTMLElement>fixture.nativeElement.querySelector('app-slider-with-label');
    expect(slider.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false');
  });
});
