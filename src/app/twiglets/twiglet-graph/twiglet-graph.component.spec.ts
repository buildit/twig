import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';

import { stateServiceStub } from '../../../non-angular/testHelpers';
import { LoadingSpinnerComponent } from './../../loading-spinner/loading-spinner.component';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { StateService } from '../../state.service';

const testBedSetup = {
  declarations: [ TwigletGraphComponent, LoadingSpinnerComponent ],
  imports: [NgbModule.forRoot()],
  providers: [
    D3Service,
    NgbModal,
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
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
