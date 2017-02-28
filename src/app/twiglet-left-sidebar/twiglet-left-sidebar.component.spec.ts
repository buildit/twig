/* tslint:disable:no-unused-variable */
import { StateService } from './../state.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';

import { TwigletLeftSidebarComponent } from './twiglet-left-sidebar.component';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('TwigletLeftSidebarComponent', () => {
  let component: TwigletLeftSidebarComponent;
  let fixture: ComponentFixture<TwigletLeftSidebarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletLeftSidebarComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletLeftSidebarComponent);
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
