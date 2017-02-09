/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Map } from 'immutable';

import { ChangelogListTwigletComponent } from './changelog-list-twiglet.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('ChangelogListComponent', () => {
  let component: ChangelogListTwigletComponent;
  let fixture: ComponentFixture<ChangelogListTwigletComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('id1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangelogListTwigletComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogListTwigletComponent);
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
