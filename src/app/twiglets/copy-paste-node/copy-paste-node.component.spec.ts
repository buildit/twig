import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';

import { CopyPasteNodeComponent } from './copy-paste-node.component';
import { mouseUpOnCanvas } from '../twiglet-graph/inputHandlers';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletGraphComponent } from '../twiglet-graph/twiglet-graph.component';

describe('CopyPasteNodeComponent', () => {
  let component: CopyPasteNodeComponent;
  let fixture: ComponentFixture<CopyPasteNodeComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule({
      declarations: [ CopyPasteNodeComponent, TwigletGraphComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ { provide: StateService, useValue: stateServiceStubbed},
        NgbModal ]
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

  it('copies the current node when copy is clicked', () => {
    spyOn(stateServiceStubbed.userState, 'setCopiedNodeId');
    fixture.nativeElement.querySelector('.fa-clone').click();
    expect(stateServiceStubbed.userState.setCopiedNodeId).toHaveBeenCalled();
  });

  it('adds the node when paste is clicked', () => {
    spyOn(stateServiceStubbed.twiglet, 'addNode');
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { id: '' } });
    fixture.nativeElement.querySelector('.fa-clipboard').click();
    expect(stateServiceStubbed.twiglet.addNode).toHaveBeenCalled();
  });

  it('should not copy if the user is not editing', () => {
    component.userState = component.userState.set('isEditing', false);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setCopiedNodeId');
    fixture.nativeElement.querySelector('.fa-clone').click();
    expect(stateServiceStubbed.userState.setCopiedNodeId).not.toHaveBeenCalled();
  });

  it('should not copy if the user is not editing', () => {
    component.userState = component.userState.set('isEditing', false);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'addNode');
    fixture.nativeElement.querySelector('.fa-clipboard').click();
    expect(stateServiceStubbed.twiglet.addNode).not.toHaveBeenCalled();
  });
});
