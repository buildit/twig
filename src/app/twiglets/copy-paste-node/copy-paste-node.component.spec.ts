import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './copy-paste-node.component';
import { EditModeButtonComponent } from './../../shared/edit-mode-button/edit-mode-button.component';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { mouseUpOnCanvas } from '../twiglet-graph/inputHandlers';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from '../twiglet-graph/twiglet-graph.component';

describe('CopyPasteNodeComponent', () => {
  let component: CopyPasteNodeComponent;
  let fixture: ComponentFixture<CopyPasteNodeComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        EditModeButtonComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
        TwigletGraphComponent
      ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyPasteNodeComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      copiedNodeId: 'firstNode',
      isEditing: true,
    });
    component.nodes = fromJS({
      firstNode: {
        attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
        id: 'firstNode',
        name: 'firstNodeName',
        radius: 10,
        type: 'ent1',
        x: 100,
        y: 100,
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('copyNode', () => {
    it('copies the current node when copy is clicked', () => {
      spyOn(stateServiceStubbed.userState, 'setCopiedNodeId');
      fixture.nativeElement.querySelector('.fa-clone').click();
      expect(stateServiceStubbed.userState.setCopiedNodeId).toHaveBeenCalled();
    });
  });

  describe('pasteNode', () => {
    it('adds the node when paste is clicked', () => {
      spyOn(stateServiceStubbed.twiglet, 'addNode');
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { id: '' } });
      fixture.nativeElement.querySelector('.fa-clipboard').click();
      expect(stateServiceStubbed.twiglet.addNode).toHaveBeenCalled();
    });

    it('does not paste a node if there is no copied node', () => {
      component.userState = component.userState.set('copiedNodeId', null);
      spyOn(stateServiceStubbed.twiglet, 'addNode');
      component.pasteNode();
      expect(stateServiceStubbed.twiglet.addNode).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    it('copies the node on meta-c if the user is editing', (done) => {
      component.userState = Map({ isEditing: true });
      const $event = {
        code: 'KeyC',
        metaKey: true,
      };
      spyOn(component, 'copyNode');
      component.handleKeyDown($event);
      // Need to jump on next tick like function
      setTimeout(() => {
        expect(component.copyNode).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('pastes the node on meta-v if the user is editing and the modal is not already open', (done) => {
      component.userState = Map({ isEditing: true });
      const $event = {
        code: 'KeyV',
        metaKey: true,
      };
      spyOn(component, 'pasteNode');
      component.handleKeyDown($event);
      // Need to jump on next tick like function
      setTimeout(() => {
        expect(component.pasteNode).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('does not open if the modal is already open', (done) => {
      spyOn(document, 'getElementsByClassName').and.returnValue(['some element']);
      component.userState = Map({ isEditing: true });
      const $event = {
        code: 'KeyV',
        metaKey: true,
      };
      spyOn(component, 'pasteNode');
      component.handleKeyDown($event);
      // Need to jump on next tick like function
      setTimeout(() => {
        expect(component.pasteNode).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('does not respond to other key presses', (done) => {
      component.userState = Map({ isEditing: true });
      const $event = {
        code: 'KeyV',
      };
      spyOn(component, 'copyNode');
      spyOn(component, 'pasteNode');
      component.handleKeyDown($event);
      // Need to jump on next tick like function
      setTimeout(() => {
        expect(component.copyNode).not.toHaveBeenCalled();
        expect(component.pasteNode).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});
