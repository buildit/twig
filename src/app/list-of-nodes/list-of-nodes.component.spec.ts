/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StateService, StateServiceStub } from '../state.service';
import { ImmutableMapOfMapsPipe } from '../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from '../node-info/node-info.component';

import { ListOfNodesComponent } from './list-of-nodes.component';

describe('ListOfNodesComponent', () => {
  let component: ListOfNodesComponent;
  let fixture: ComponentFixture<ListOfNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfNodesComponent, ImmutableMapOfMapsPipe, NodeInfoComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
