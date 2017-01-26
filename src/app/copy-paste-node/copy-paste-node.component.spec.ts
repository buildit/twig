/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CopyPasteNodeComponent } from './copy-paste-node.component';
import { StateService } from '../state.service';
import { TwigletGraphComponent } from '../twiglet-graph/twiglet-graph.component';
import { mouseUpOnCanvas } from '../twiglet-graph/inputHandlers';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('CopyPasteNodeComponent', () => {
  let component: CopyPasteNodeComponent;
  let fixture: ComponentFixture<CopyPasteNodeComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('id1');

  beforeEach(async(() => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('copies the current node when copy is clicked', () => {
    component.disabled = false;
    component.userState.copiedNodeId = 'firstNode';
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setCopiedNodeId');
    fixture.nativeElement.querySelector('.fa-clone').click();
    expect(stateServiceStubbed.userState.setCopiedNodeId).toHaveBeenCalled();
  });

  it('adds the node when paste is clicked', () => {
    component.disabled = false;
    component.userState.copiedNodeId = 'firstNode';
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'addNode');
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { id: '' } });
    fixture.nativeElement.querySelector('.fa-clipboard').click();
    expect(stateServiceStubbed.twiglet.addNode).toHaveBeenCalled();
  });

  it('should do nothing if disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setCopiedNodeId');
    spyOn(stateServiceStubbed.twiglet, 'addNode');
    fixture.nativeElement.querySelector('.fa-clone').click();
    expect(stateServiceStubbed.userState.setCopiedNodeId).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.fa-clipboard').click();
    expect(stateServiceStubbed.twiglet.addNode).not.toHaveBeenCalled();
  });
});
