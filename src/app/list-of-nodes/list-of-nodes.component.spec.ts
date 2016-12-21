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

  it('should register two services', () => {
    expect(component.nodesService).toBeTruthy();
    expect(component.viewService).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should have an initialized formNode', () => {
      component.ngOnInit();
      expect(component.formNode).toEqual(jasmine.any(Object));
      const expectedProperties = [
        'id',
        'name',
        'type',
      ];
      expectedProperties.forEach(prop => expect(component.formNode[prop]).toBeTruthy());
    });
  });

  describe('addNode', () => {
    it('should use the nodeservice to add the node in the form', () => {
      const formNode = component.formNode;
      spyOn(component.nodesService, 'addNode');
      component.addNode();
      expect(component.nodesService.addNode).toHaveBeenCalledWith(formNode);
    });

    it('should create a new node in the form', () => {
      const formNode = component.formNode;
      component.addNode();
      expect(component.formNode).not.toEqual(formNode);
    });
  });

  describe('removeNode', () => {
    it('should call nodeService.removeNode', () => {
      const node = {
        id: 'testNode',
      };
      spyOn(component.nodesService, 'removeNode');
      component.removeNode(node);
      expect(component.nodesService.removeNode).toHaveBeenCalledWith(node);
    });
  });

  describe('rendering', () => {
    it('should render three <app-node-info> elements', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-node-info').length).toEqual(3);
    });

    it('should render a form', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('input').length).toEqual(3);
      expect(compiled.querySelector('.newNode').querySelectorAll('button').length).toEqual(1);
    });
  });
});
