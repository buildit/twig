import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { LoadingSpinnerComponent } from './../../shared/loading-spinner/loading-spinner.component';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './twiglet-graph.component';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.viewService.setGravityPoints({
  gp1: {
    id: 'id1', name: 'gp1', x: 100, y: 100,
  },
  gp2: {
    id: 'id2', name: 'gp2', x: 600, y: 1000,
  }
});

const testBedSetup = {
  declarations: [
    AddNodeByDraggingButtonComponent,
    CopyPasteNodeComponent,
    HeaderTwigletComponent,
    HeaderTwigletEditComponent,
    LoadingSpinnerComponent,
    TwigletDropdownComponent,
    TwigletGraphComponent,
  ],
  imports: [ NgbModule.forRoot() ],
  providers: [
    D3Service,
    NgbModal,
    { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
    { provide: StateService, useValue: stateServiceStubbed },
    { provide: ToastsManager, useValue: mockToastr },
  ]
};

export { testBedSetup };


describe('TwigletGraphComponent', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.width = 1000;
    component.height = 500;
    component.viewData = fromJS({
      filters: {},
      gravityPoints: {
        gp1: {
          id: 'id1', name: 'gp1', x: 100, y: 100,
        },
        gp2: {
          id: 'id2', name: 'gp2', x: 600, y: 1000,
        }
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three nodes on it', () => {
    const compiled = fixture.debugElement.nativeElement;
    const nodeGroups = compiled.querySelectorAll('.node-group');
    expect(nodeGroups.length).toEqual(3);
  });

  it('should have two links on it', () => {
    const compiled = fixture.debugElement.nativeElement;
    const nodeGroups = compiled.querySelectorAll('.link-group');
    expect(nodeGroups.length).toEqual(2);
  });

  describe('resizing', () => {
    beforeEach(() => {
      component.width = 100;
      component.height = 200;
      component.onResize(<any>{
        target: {
          clientHeight: 300,
          clientWidth: 400,
        }
      })
    });

    it('upates the width', () => {
      expect(component.width).toEqual(400);
    });

    it('updates the height', () => {
      expect(component.height).toEqual(300);
    });
  });

  describe('keyBoardDown', () => {
    it('activates the altPressed flag', () => {
      component.keyboardDown(<any>{ altKey: true });
      expect(component.altPressed).toBeTruthy();
    });
  });

  describe('keyBoardUp', () => {
    it('deactivates the altPressed flag', () => {
      component.keyboardDown(<any>{ altKey: true });
      component.keyboardInput(<any>{});
      expect(component.altPressed).toBeFalsy();
    });
  })
});
