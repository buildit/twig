import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { D3Node, Link } from '../../../non-angular/interfaces';
import { handleGraphMutations } from './handleGraphMutations';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.updateNodes = () => undefined;


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

describe('TwigletGraphComponent:handleGraphMutations', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  describe('changes to nodes', () => {
    beforeEach(() => {
    const currentlyGraphedNodesObject = {
      links: {},
      nodes: {
        deletedNode: {
          id: 'deletedNode',
          name: 'Deleted Node',
          type: 'ent1',
        },
        firstNode: {
          attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
          id: 'firstNode',
          name: 'firstNodeName',
          type: 'ent1',
          x: 100,
          y: 100,
        },
        secondNode: {
          attrs: [],
          id: 'secondNode',
          name: 'secondNodeName',
          type: 'ent2',
          x: 200,
          y: 300,
        },
        staticNode: {
          id: 'staticNode',
          name: 'Static Node',
          type: 'ent2',
        },
        thirdNode: {
          attrs: [],
          id: 'thirdNode',
          name: 'thirdNodeName',
          type: 'ent3',
        },
        updatedNode: {
          id: 'updatedNode',
          name: 'Updated Node',
          type: 'ent3',
        },
      }
    };
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    // Put some nodes on the screen.
    handleGraphMutations.bind(component)(fromJS(currentlyGraphedNodesObject));
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
        const response = {
          links: {},
          nodes: {
            addedNode: {
              id: 'addedNode',
              name: 'Added Node',
              type: 'ent5'
            },
            firstNode: {
              attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
              id: 'firstNode',
              name: 'firstNodeName',
              type: 'ent1',
              x: 100,
              y: 100,
            },
            secondNode: {
              attrs: [],
              id: 'secondNode',
              name: 'secondNodeName',
              type: 'ent2',
              x: 200,
              y: 300,
            },
            staticNode: {
              id: 'staticNode',
              name: 'Static Node',
              type: 'ent2',
            },
            thirdNode: {
              attrs: [],
              id: 'thirdNode',
              name: 'thirdNodeName',
              type: 'ent3',
            },
            updatedNode: {
              id: 'updatedNode',
              name: 'A new name!',
              type: 'ent4'
            },
          }
        };
        handleGraphMutations.bind(component)(fromJS(response));
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
        fixture.detectChanges();
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

  describe('changes to links', () => {
    beforeEach(() => {
    const currentlyGraphedNodesObject = {
      links: {
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
      },
      nodes: {
        firstNode: {
          attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
          id: 'firstNode',
          name: 'firstNodeName',
          type: 'ent1',
          x: 100,
          y: 100,
        },
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
        secondNode: {
          attrs: [],
          id: 'secondNode',
          name: 'secondNodeName',
          type: 'ent2',
          x: 200,
          y: 300,
        },
        thirdNode: {
          attrs: [],
          id: 'thirdNode',
          name: 'thirdNodeName',
          type: 'ent3',
        },
      }
    };
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Put some nodes on the screen.
    handleGraphMutations.bind(component)(fromJS(currentlyGraphedNodesObject));
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
        const response = {
          links: {
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
          },
          nodes: {
            firstNode: {
              attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
              id: 'firstNode',
              name: 'firstNodeName',
              type: 'ent1',
              x: 100,
              y: 100,
            },
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
            secondNode: {
              attrs: [],
              id: 'secondNode',
              name: 'secondNodeName',
              type: 'ent2',
              x: 200,
              y: 300,
            },
            thirdNode: {
              attrs: [],
              id: 'thirdNode',
              name: 'thirdNodeName',
              type: 'ent3',
            },
          }
        };
        handleGraphMutations.bind(component)(fromJS(response));
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
