/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';

import { ChangelogListComponent } from './changelog-list.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('ChangelogListComponent', () => {
  let component: ChangelogListComponent;
  let fixture: ComponentFixture<ChangelogListComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('name1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangelogListComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
