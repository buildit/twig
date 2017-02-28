/* tslint:disable:no-unused-variable */
import { fromJS } from 'immutable';
import { StateService } from './../state.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeftSideBarComponent } from './left-side-bar.component';
import { TwigletLeftSidebarComponent } from '../twiglet-left-sidebar/twiglet-left-sidebar.component';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('LeftSideBarComponent', () => {
  let component: LeftSideBarComponent;
  let fixture: ComponentFixture<LeftSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSideBarComponent, TwigletLeftSidebarComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    it('shows the placeholder for home paragraph if the mode is home', () => {
      component.userState = fromJS({
        mode: 'home',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('p').innerHTML).toEqual('Placeholder for Home');
    });

    it('shows the twiglet filters if the mode is twiglet', () => {
      component.userState = fromJS({
        filters: {
          attributes: [],
          types: {},
        },
        mode: 'twiglet',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-twiglet-left-sidebar')).toBeTruthy();
    });

    it('shows the placeholder for models paragraph is the mode is model', () => {
      component.userState = fromJS({
        mode: 'model',
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('p').innerHTML).toEqual('Placeholder for Models');
    });
  });
});
