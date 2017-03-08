/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletFiltersComponent } from './twiglet-filters.component';

describe('TwigletFiltersComponent', () => {
  let component: TwigletFiltersComponent;
  let fixture: ComponentFixture<TwigletFiltersComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletFiltersComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFiltersComponent);
    component = fixture.componentInstance;
    component.userState = fromJS({
      filters: {
        attributes: [],
        types: {},
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
