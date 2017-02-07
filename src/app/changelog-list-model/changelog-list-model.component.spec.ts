/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Map } from 'immutable';

import { ChangelogListModelComponent } from './changelog-list-model.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('ChangelogListModelComponent', () => {
  let component: ChangelogListModelComponent;
  let fixture: ComponentFixture<ChangelogListModelComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.model.loadModel('bsc');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangelogListModelComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogListModelComponent);
    component = fixture.componentInstance;
    component.model = Map({
      _id: 'bsc',
      changelog_url: 'model/modelurl/changelog',
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
