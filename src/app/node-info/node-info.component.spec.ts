/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NodeInfoComponent } from './node-info.component';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeInfoComponent ]
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
      let compiled = fixture.debugElement.nativeElement;
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
      let compiled = fixture.debugElement.nativeElement;
      compiled.querySelectorAll('span.node-paramater').forEach((element, index) => {
        expect(element.textContent).toEqual(expectedValues[index]);
      });
    });
  });
});
