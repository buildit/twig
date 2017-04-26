import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Map } from 'immutable';

import { AddGravityPointToggleComponent } from './add-gravity-point-toggle.component';
import { FontAwesomeToggleButtonComponent } from './../../shared/font-awesome-toggle-button/font-awesome-toggle-button.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('AddGravityPointToggleComponent', () => {
  let component: AddGravityPointToggleComponent;
  let fixture: ComponentFixture<AddGravityPointToggleComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGravityPointToggleComponent, FontAwesomeToggleButtonComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed} ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGravityPointToggleComponent);
    component = fixture.componentInstance;
    component.userState = Map({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
