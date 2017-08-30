import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { fromJS } from 'immutable';

import { GravityListComponent } from './gravity-list.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('GravityListComponent', () => {
  let component: GravityListComponent;
  let fixture: ComponentFixture<GravityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GravityListComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStub() } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityListComponent);
    component = fixture.componentInstance;
    component.userState = fromJS({
      gravityPoints: {},
      user: '',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});