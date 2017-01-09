/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService, StateServiceStub } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { fromJS } from 'immutable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

import { handleLinkMutations, handleNodeMutations } from './handleGraphMutations';

describe('TwigletGraphComponent:handleGraphMutations', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletGraphComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ D3Service, NgbModal, { provide: StateService, useValue: new StateServiceStub()} ],
    })
    .compileComponents();
  }));

  describe('handleNodeMutations', () => {
    beforeEach(() => {
    const currentlyGraphedNodesObject: { [key: string]: D3Node } = {
      deletedNode: {
        id: 'deletedNode',
        name: 'Deleted Node',
        type: 'ent1',
      },
      staticNode: {
        id: 'staticNode',
        name: 'Static Node',
        type: 'ent2',
      },
      updatedNode: {
        id: 'updatedNode',
        name: 'Updated Node',
        type: 'ent3',
      },
    };

    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    // Put some nodes on the screen.
    handleNodeMutations.bind(component)(fromJS(currentlyGraphedNodesObject));
    fixture.detectChanges();

  });

    it('can load an initial group of nodes', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#id-deletedNode')).toBeTruthy();
      const staticNodeGroup = compiled.querySelector('#id-staticNode');
      expect(staticNodeGroup).toBeTruthy();
      expect(staticNodeGroup.querySelector('.node-image').textContent).toEqual('@');
      expect(staticNodeGroup.querySelector('.node-name').textContent).toEqual('Static Node');
      const updatedNodeGroup = compiled.querySelector('#id-updatedNode');
      expect(updatedNodeGroup).toBeTruthy();
      expect(updatedNodeGroup.querySelector('.node-image').textContent).toEqual('#');
      expect(updatedNodeGroup.querySelector('.node-name').textContent).toEqual('Updated Node');
    });

    describe('modifying nodes already on the page', () => {
      beforeEach(() => {
        const response: { [key: string]: D3Node } = {
          addedNode: {
            id: 'addedNode',
            name: 'Added Node',
            type: 'ent5'
          },
          staticNode: {
            id: 'staticNode',
            name: 'Static Node',
            type: 'ent2',
          },
          updatedNode: {
            id: 'updatedNode',
            name: 'A new name!',
            type: 'ent4'
          },
        };
        handleNodeMutations.bind(component)(fromJS(response));
        fixture.detectChanges();
      });

      it('Leaves nodes that have not changed alone', () => {
        const compiled = fixture.debugElement.nativeElement;
        const staticNodeGroup = compiled.querySelector('#id-staticNode');
        expect(staticNodeGroup).toBeTruthy();
        expect(staticNodeGroup.querySelector('.node-image').textContent).toEqual('@');
        expect(staticNodeGroup.querySelector('.node-name').textContent).toEqual('Static Node');
      });

      it('Adds new nodes', () => {
        const compiled = fixture.debugElement.nativeElement;
        const addedNodeGroup = compiled.querySelector('#id-addedNode');
        expect(addedNodeGroup).toBeTruthy();
        expect(addedNodeGroup.querySelector('.node-image').textContent).toEqual('%');
        expect(addedNodeGroup.querySelector('.node-name').textContent).toEqual('Added Node');
      });

      it('can update the image and names of nodes', () => {
        const compiled = fixture.debugElement.nativeElement;
        const updatedNodeGroup = compiled.querySelector('#id-updatedNode');
        expect(updatedNodeGroup).toBeTruthy();
        expect(updatedNodeGroup.querySelector('.node-image').textContent).toEqual('$');
        expect(updatedNodeGroup.querySelector('.node-name').textContent).toEqual('A new name!');
      });

      it('removes the correct node', () => {
        const compiled = fixture.debugElement.nativeElement;
        const deleteNodeGroup = compiled.querySelector('#id-deletedNode');
        expect(deleteNodeGroup).toBeFalsy();
      });
    });
  });

  describe('handleLinkMutations', () => {
    beforeEach(() => {
    const currentlyGraphedNodesObject: { [key: string]: D3Node } = {
      node1: {
        id: 'node1',
        name: 'One',
        type: 'ent1',
      },
      node2: {
        id: 'node2',
        name: 'Two',
        type: 'ent2',
      },
      node3: {
        id: 'node3',
        name: 'Three',
        type: 'ent3',
      },
      node4: {
        id: 'node4',
        name: 'Four',
        type: 'ent4',
      },
    };

    const currentlyGraphedLinksObject: { [key: string]: Link } = {
      deletedLink: {
        association: 'Deleted Link',
        id: 'deletedLink',
        source: 'node1',
        target: 'node2',
      },
      staticNode: {
        association: 'Static Link',
        id: 'staticLink',
        source: 'node2',
        target: 'node3',
      },
      updatedNode: {
        association: 'Updated Link',
        id: 'updatedLink',
        source: 'node3',
        target: 'node4',
      },
    };

    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Put some nodes on the screen.
    handleNodeMutations.bind(component)(fromJS(currentlyGraphedNodesObject));
    fixture.detectChanges();
    // Put some links on the screen.
    handleLinkMutations.bind(component)(fromJS(currentlyGraphedLinksObject));
    fixture.detectChanges();

  });

    it('can load an initial group of links', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#id-deletedLink')).toBeTruthy();
      const staticLinkGroup = compiled.querySelector('#id-staticLink');
      expect(staticLinkGroup).toBeTruthy();
      expect(staticLinkGroup.querySelector('text').textContent).toEqual('Static Link');
      const updatedLinkGroup = compiled.querySelector('#id-updatedLink');
      expect(updatedLinkGroup).toBeTruthy();
      expect(updatedLinkGroup.querySelector('text').textContent).toEqual('Updated Link');
    });

    describe('modifying links already on the page', () => {
      beforeEach(() => {
        const response: { [key: string]: Link } = {
          addedLink: {
            association: 'Added Link',
            id: 'addedLink',
            source: 'node4',
            target: 'node1',
          },
          staticLink: {
            association: 'Static Link',
            id: 'staticLink',
            source: 'node2',
            target: 'node3',
          },
          updatedLink: {
            association: 'Different Association',
            id: 'updatedLink',
            source: 'node3',
            target: 'node4',
          },
        };
        handleLinkMutations.bind(component)(fromJS(response));
        fixture.detectChanges();
      });

      it('Leaves links that have not changed alone', () => {
        const compiled = fixture.debugElement.nativeElement;
        const staticLinkGroup = compiled.querySelector('#id-staticLink');
        expect(staticLinkGroup).toBeTruthy();
        expect(staticLinkGroup.querySelector('text').textContent).toEqual('Static Link');
      });

      it('Adds new links', () => {
        const compiled = fixture.debugElement.nativeElement;
        const addedLinkGroup = compiled.querySelector('#id-addedLink');
        expect(addedLinkGroup).toBeTruthy();
        expect(addedLinkGroup.querySelector('text').textContent).toEqual('Added Link');
      });

      it('can update the association of links', () => {
        const compiled = fixture.debugElement.nativeElement;
        const updatedLinkGroup = compiled.querySelector('#id-updatedLink');
        expect(updatedLinkGroup).toBeTruthy();
        expect(updatedLinkGroup.querySelector('text').textContent).toEqual('Different Association');
      });

      it('removes the correct link', () => {
        const compiled = fixture.debugElement.nativeElement;
        const deletedLinkGroup = compiled.querySelector('#id-deletedLink');
        expect(deletedLinkGroup).toBeFalsy();
      });
    });
  });
});
