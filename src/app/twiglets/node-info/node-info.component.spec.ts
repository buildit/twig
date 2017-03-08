import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NodeInfoComponent } from './node-info.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

const node = {
              fx: 100,
              fy: 150,
              id: 'firstNode',
              name: 'First Node',
              type: '#',
              x: 100,
              y: 150,
            };

describe('NodeInfoComponent', () => {
  let component: NodeInfoComponent;
  let fixture: ComponentFixture<NodeInfoComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeInfoComponent ],
      providers: [{ provide: StateService, useValue: stateServiceStubbed }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeInfoComponent);
    component = fixture.componentInstance;
    component.node = node;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render the labels of the node', () => {
      const expectedLabels = [
        'ID: ',
        'Name: ',
        'Type: ',
        'x: ',
        'y: ',
        'fx: ',
        'fy: ',
      ];
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelectorAll('b').forEach((element, index) => {
        expect(element.textContent).toEqual(expectedLabels[index]);
      });
    });

    it('should render the values of the node', () => {
      const expectedValues = [
        'firstNode',
        'First Node',
        '#',
        '100',
        '150',
        '100',
        '150',
      ];
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelectorAll('span.node-paramater').forEach((element, index) => {
        expect(element.textContent).toEqual(expectedValues[index]);
      });
    });
  });
});
