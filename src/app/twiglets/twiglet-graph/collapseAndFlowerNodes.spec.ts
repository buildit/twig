import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { D3Node, Link } from '../../../non-angular/interfaces';
import { toggleNodeCollapsibility } from './collapseAndFlowerNodes';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

const stateServiceStubbed = stateServiceStub();

const testBedSetup = {
  declarations: [ TwigletGraphComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
    { provide: StateService, useValue: stateServiceStubbed },
    { provide: ToastsManager, useValue: mockToastr },
  ],
};

describe('TwigletGraphComponent:toggleNodeCollapsibility', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedSetup).compileComponents();
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component['allNodes'] = [
      { id: 'parent' },
      { id: 'child1' },
      { id: 'child2' },
      { id: 'grandChild1' },
      { id: 'grandChild2' },
      { id: 'grandChild3', collapsedAutomatically: false },
    ];
    component['allLinks'] = [
      { id: 'parent-child1', source: { id: 'parent' }, target: { id: 'child1' } },
      { id: 'parent-child2', source: { id: 'parent' }, target: { id: 'child2' } },
      { id: 'child1-grandChild1', source: { id: 'child1' }, target: { id: 'grandChild1' } },
      { id: 'child1-grandChild2', source: { id: 'child1' }, target: { id: 'grandChild2' } },
      { id: 'child1-grandChild3', source: { id: 'child1' }, target: { id: 'grandChild3' } },
    ];
    component.ngOnDestroy = jasmine.createSpy('ngOnDestroy');
    spyOn(stateServiceStubbed.twiglet, 'replaceNodesAndLinks');
  }));

  describe('NOT cascading collapse', () => {
    describe('collapsing a group of nodes - 1 generation deep', () => {
      let nodes: D3Node[];
      let spy;
      beforeEach(() => {
        toggleNodeCollapsibility.bind(component)({ id: 'child1' });
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        nodes = <D3Node[]>spy.calls.argsFor(0)[0];
      });

      it('toggles the child1 node as collapsed', () => {
        expect(nodes[1].collapsed).toBeTruthy();
      });

      it('notes that child1 was not collapsed automatically', () => {
        expect(nodes[1].collapsedAutomatically).toBe(false);
      });

      it('marks all the grandchild nodes as hidden', () => {
        expect(nodes.filter(node => node.id.includes('grandChild')).every(node => node.hidden === true)).toBeTruthy();
      });

      it('notes that all of the grandchildren were collapsed automatically', () => {
        expect(nodes.filter(node => node.id.includes('grandChild')).every(node => node.collapsedAutomatically === true)).toBeTruthy();
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('flowering a group of nodes - 1 generation deep', () => {
      let nodes: D3Node[];
      let spy;
      beforeEach(() => {
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        toggleNodeCollapsibility.bind(component)({ id: 'child1' });
        component['allNodes'] = spy.calls.argsFor(0)[0];
        component['allLinks'] = spy.calls.argsFor(0)[1];
        toggleNodeCollapsibility.bind(component)({ id: 'child1', collapsed: true });
        nodes = <D3Node[]>spy.calls.argsFor(1)[0];
      });

      it('marks the collapsed tag as false on child1 node', () => {
        expect(nodes[1].collapsed).toBe(false);
      });

      it('removes the collapsed automatically tag from the child1 node', () => {
        expect(nodes[1].collapsedAutomatically).toBe(undefined);
      });

      it('marks all the grandchild nodes as hidden = false', () => {
        expect(nodes.filter(node => node.id.includes('grandChild')).every(node => node.hidden === false)).toBeTruthy();
      });

      it('removes the collapsed automatically tag from the grandchildren nodes', () => {
        expect(nodes.filter(node => node.id.includes('grandChild')).every(node => node.collapsedAutomatically === undefined)).toBeTruthy();
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('collapsing a group of nodes - 2 generations deep', () => {
      let nodes: D3Node[];
      let links: Link[];
      let spy;
      beforeEach(() => {
        toggleNodeCollapsibility.bind(component)({ id: 'parent' });
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        nodes = spy.calls.argsFor(0)[0];
        links = spy.calls.argsFor(0)[1];
      });

      it('toggles the parent node as collapsed', () => {
        expect(nodes[0].collapsed).toBeTruthy();
      });

      it('notes that parent was not collapsed automatically', () => {
        expect(nodes[0].collapsedAutomatically).toBe(false);
      });

      it('marks all the child nodes as hidden', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.hidden === true)).toBeTruthy();
      });

      it('notes that all of the children were collapsed automatically', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.collapsedAutomatically === true)).toBeTruthy();
      });

      it('remaps the source of child -> grandchild links to parent -> grandchild links', () => {
        expect(links.filter(link => link.id.includes('-grandchild')).every(link => (<D3Node>link.source).id === 'parent')).toBeTruthy();
      });

      it('saves the original source of the child -> grandchild links so they can be restored', () => {
        expect(links.filter(link => link.id.includes('-grandchild')).every(link => link.sourceOriginal === 'child1')).toBeTruthy();
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('flowering a group of nodes - 2 generations deep', () => {
      let nodes: D3Node[];
      let links: Link[];
      let spy;
      beforeEach(() => {
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        toggleNodeCollapsibility.bind(component)({ id: 'parent' });
        component['allNodes'] = spy.calls.argsFor(0)[0];
        component['allLinks'] = spy.calls.argsFor(0)[1];
        toggleNodeCollapsibility.bind(component)({ id: 'parent', collapsed: true });
        nodes = spy.calls.argsFor(1)[0];
        links = spy.calls.argsFor(1)[1];
      });

      it('toggles the parent node as collapsed', () => {
        expect(nodes[0].collapsed).toBe(false);
      });

      it('removes the collapsed automatically tag on the parent', () => {
        expect(nodes[0].collapsedAutomatically).toBe(undefined);
      });

      it('marks all of the children hidden = false', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.hidden === false)).toBeTruthy();
      });

      it('removes the collapsed automatically tag from all of the children nodes', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.collapsedAutomatically === undefined)).toBeTruthy();
      });

      it('remaps the source of parent -> grandchild links back to child1 -> grandchild links', () => {
        expect(links.filter(link => link.id.includes('-grandchild')).every(link => (<D3Node>link.source).id === 'child1')).toBeTruthy();
      });

      it('deletes the sourceOriginal tag as it is no longer needed', () => {
        expect(links.filter(link => link.id.includes('-grandchild')).every(link => link.sourceOriginal === undefined)).toBeTruthy();
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Cascading Collapse', () => {
    beforeEach(() => {
      component.userState = component.userState.set('cascadingCollapse', true);
    });
    describe('collapsing a group of nodes - 2 generations deep', () => {
      let nodes: D3Node[];
      let links: Link[];
      let spy;
      beforeEach(() => {
        toggleNodeCollapsibility.bind(component)({ id: 'parent' });
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        nodes = spy.calls.argsFor(0)[0];
        links = spy.calls.argsFor(0)[1];
      });

      it('toggles the parent node as collapsed', () => {
        expect(nodes[0].collapsed).toBeTruthy();
      });

      it('notes that parent was not collapsed automatically', () => {
        expect(nodes[0].collapsedAutomatically).toBe(false);
      });

      it('marks all the child nodes as hidden', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.hidden === true)).toBeTruthy();
      });

      it('marks all of the grandChild nodes as hidden', () => {
        expect(nodes.filter(node => node.id.startsWith('grandChild')).every(node => node.hidden === true)).toBeTruthy();
      });

      it('notes that all of the children were collapsed automatically', () => {
        expect(nodes.filter(node => node.id.startsWith('child')).every(node => node.collapsedAutomatically === true)).toBeTruthy();
      });

      it('nodes that all of the grandChildren were collapsed automatically', () => {
        expect(nodes.filter(node => node.id.startsWith('grandChild')).every(node => node.collapsedAutomatically === true)).toBeTruthy();
      });

      it('does not modify any of the link sources', () => {
        expect(links.every(link => {
          const [ source ] = link.id.split('-');
          return (<D3Node>link.source).id === source;
        })).toBeTruthy();
      });

      it('does not modify any of the link targets', () => {
        expect(links.every(link => {
          const [ source, target ] = link.id.split('-');
          return (<D3Node>link.target).id === target;
        })).toBeTruthy();
      });

      it('does not create any sourceOriginals', () => {
        expect(links.every(link => link.sourceOriginal === undefined));
      });

      it('does not create any targetOriginals', () => {
        expect(links.every(link => link.targetOriginal === undefined));
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('flowering a group of nodes - 2 generations deep', () => {
      let nodes: D3Node[];
      let links: Link[];
      let spy;
      beforeEach(() => {
        spy = <jasmine.Spy>stateServiceStubbed.twiglet.replaceNodesAndLinks;
        toggleNodeCollapsibility.bind(component)({ id: 'parent' });
        component['allNodes'] = spy.calls.argsFor(0)[0];
        component['allLinks'] = spy.calls.argsFor(0)[1];
        toggleNodeCollapsibility.bind(component)({ id: 'parent', collapsed: true });
        nodes = spy.calls.argsFor(1)[0];
        links = spy.calls.argsFor(1)[1];
      });

      it('toggles the parent node as collapsed', () => {
        expect(nodes[0].collapsed).toBe(false);
      });

      it('notes that parent was not collapsed automatically', () => {
        expect(nodes[0].collapsedAutomatically).toBe(undefined);
      });

      it('marks all the child nodes as hidden = false', () => {
        expect(nodes.filter(n => n.id.startsWith('child')).every(n => n.hidden === false)).toBeTruthy();
      });

      it('marks all of the grandChild nodes as hidden = false', () => {
        expect(nodes.filter(n => n.id.startsWith('grandChild')).every(n => n.hidden === false)).toBeTruthy();
      });

      it('notes that all of the children were collapsed automatically', () => {
        expect(nodes.filter(n => n.id.startsWith('child')).every(n => n.collapsedAutomatically === undefined)).toBeTruthy();
      });

      it('nodes that all of the grandChildren were collapsed automatically', () => {
        expect(nodes.filter(n => n.id.startsWith('grandChild')).every(n => n.collapsedAutomatically === undefined)).toBeTruthy();
      });

      it('does not modify any of the link sources', () => {
        expect(links.every(link => {
          const [ source ] = link.id.split('-');
          return (<D3Node>link.source).id === source;
        })).toBeTruthy();
      });

      it('does not modify any of the link targets', () => {
        expect(links.every(link => {
          const [ source, target ] = link.id.split('-');
          return (<D3Node>link.target).id === target;
        })).toBeTruthy();
      });

      it('calls reaplceNodesAndLinks on the service', () => {
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
