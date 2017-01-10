/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CopyPasteNodeComponent } from './copy-paste-node.component';
import { StateService, StateServiceStub } from '../state.service';
import { TwigletGraphComponent } from '../twiglet-graph/twiglet-graph.component';
import { mouseUpOnCanvas } from '../twiglet-graph/inputHandlers';

fdescribe('CopyPasteNodeComponent', () => {
  let component: CopyPasteNodeComponent;
  let fixture: ComponentFixture<CopyPasteNodeComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyPasteNodeComponent, TwigletGraphComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ { provide: StateService, useValue: stateService},
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

  it('copies the current node id when copy is clicked', () => {
    spyOn(stateService.userState, 'setCopiedNodeId');
    fixture.nativeElement.querySelector('.fa-clone').click();
    expect(stateService.userState.setCopiedNodeId).toHaveBeenCalled();
  });

  it('calls the paste function when paste is clicked', () => {
    // spyOn(component, 'pasteNode');
    spyOn(stateService.twiglet.nodes, 'addNode');
    // spyOn(component, 'testLog');
    component.userState.copiedNodeId = 'firstNode';
    fixture.nativeElement.querySelector('.fa-clipboard').click();
    // expect(component.pasteNode).toHaveBeenCalled();
    // expect(component.testLog).toHaveBeenCalled();
    expect(stateService.twiglet.nodes.addNode).toHaveBeenCalled();
  });
});
