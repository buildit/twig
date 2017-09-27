import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

import { TwigletGravityComponent } from './twiglet-gravity.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';
import { GravityListComponent } from './../gravity-list/gravity-list.component';

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
    component.userState = fromJS({});
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
