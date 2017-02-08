/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Map } from 'immutable';

import { ChangelogListComponent } from './changelog-list.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('ChangelogListComponent', () => {
  let component: ChangelogListComponent;
  let fixture: ComponentFixture<ChangelogListComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('id1');

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
    component.twiglet = Map({
      name: 'a name',
    });
    component.ngOnChanges({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the changelog', () => {
    expect(component.changelog.length).toEqual(2);
  });
});
