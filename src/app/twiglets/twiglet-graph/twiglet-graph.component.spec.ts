import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { Observable } from 'rxjs/Observable';
import { fromJS, Map } from 'immutable';

import { LoadingSpinnerComponent } from './../../shared/loading-spinner/loading-spinner.component';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

const stateServiceStubbed = stateServiceStub();

const testBedSetup = {
  declarations: [ TwigletGraphComponent, LoadingSpinnerComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
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
    component.userState = fromJS({
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
});
