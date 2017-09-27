import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

import { TwigletGravityComponent } from './twiglet-gravity.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';
import { GravityListComponent } from './../gravity-list/gravity-list.component';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('TwigletGravityComponent', () => {
  let component: TwigletGravityComponent;
  let fixture: ComponentFixture<TwigletGravityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletGravityComponent, ToggleButtonComponent, GravityListComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGravityComponent);
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
    const toggle = <HTMLElement>fixture.nativeElement.querySelector('app-toggle-button');
    expect(toggle.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false');
  });

  it('disables the controls if there is a view loaded', () => {
    component.userState = fromJS({
      [USERSTATE.CURRENT_VIEW_NAME]: 'a view'
    });
    fixture.detectChanges();
    const toggle = <HTMLElement>fixture.nativeElement.querySelector('app-toggle-button');
    expect(toggle.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('true');
  });

  it('enables the controls if there is a view loaded but the user is in edit mode', () => {
    component.userState = fromJS({
      [USERSTATE.CURRENT_VIEW_NAME]: 'a view',
      [USERSTATE.IS_EDITING_VIEW]: true,
    });
    fixture.detectChanges();
    const toggle = <HTMLElement>fixture.nativeElement.querySelector('app-toggle-button');
    expect(toggle.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false');
  });
});
