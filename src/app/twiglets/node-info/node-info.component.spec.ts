import { D3Node } from './../../../non-angular/interfaces/twiglet/node';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { clone } from 'ramda';

import { NodeInfoComponent } from './node-info.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

const node = {
  attrs: [
    {
      key: 'attr1',
      value: 'somevalue'
    },
    {
      key: 'link',
      value: 'http://buildit.digital',
    }
  ],
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
  });

  it('should create', () => {
    component.node = node;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render the labels of the node', () => {
      component.node = node;
      fixture.detectChanges();
      const expectedLabels = [
        'ID: ',
        'Name: ',
        'Type: ',
        'x: ',
        'y: ',
        'fx: ',
        'fy: ',
        'attr1',
        'link',
      ];
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelectorAll('b').forEach((element, index) => {
        expect(element.textContent).toEqual(expectedLabels[index]);
      });
    });

    it('should render the values of the node', () => {
      component.node = node;
      fixture.detectChanges();
      const expectedValues = [
        'firstNode',
        'First Node',
        '#',
        '100',
        '150',
        '100',
        '150',
        'somevalue',
        'http://buildit.digital'
      ];
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelectorAll('span.node-paramater').forEach((element, index) => {
        expect(element.textContent).toEqual(expectedValues[index]);
      });
    });

    it('lists all of the parameters', () => {
      component.node = node;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.param').length).toEqual(4);
    });

    it('turns valid urls into links', () => {
      component.node = node;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.param a')).toBeTruthy();
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.node = node;
      fixture.detectChanges();
      spyOn(component.stateService.userState, 'setFilter');
    });

    it('clicking on the type label should set a filter by type', () => {
      fixture.nativeElement.querySelector('.clickable').click();
      expect(component.stateService.userState.setFilter).toHaveBeenCalledWith([
        {
          attributes: [{
            key: '',
            value: ''
          }],
          type: '#'
        }
      ]);
    });

    it('clicking on the attribute label should set a filter by attribute', () => {
      fixture.nativeElement.querySelectorAll('.clickable')[1].click();
      expect(component.stateService.userState.setFilter).toHaveBeenCalledWith([
        {
          attributes: [{
            key: 'attr1',
            value: ''
          }],
          type: ''
        }
      ]);
    });
  });
});
