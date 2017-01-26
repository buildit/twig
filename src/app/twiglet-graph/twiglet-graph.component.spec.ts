import { Router } from '@angular/router';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { D3Service } from 'd3-ng2-service';
import { StateService } from '../state.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { stateServiceStub } from '../../non-angular/testHelpers';

import { TwigletGraphComponent } from './twiglet-graph.component';

const testBedSetup = {
  declarations: [ TwigletGraphComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
    { provide: ActivatedRoute, useValue: { params: Observable.of({id: 'id1'}) } },
    { provide: StateService, useValue: stateServiceStub() } ]
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
