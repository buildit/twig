import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { HeaderModelComponent } from './../header-model/header-model.component';
import { ModelDropdownComponent } from './../model-dropdown/model-dropdown.component';
import { ModelInfoComponent } from './model-info.component';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { DismissibleHelpModule } from '../../directives/dismissible-help/dismissible-help.module';

describe('ModelInfoComponent', () => {
  let component: ModelInfoComponent;
  let fixture: ComponentFixture<ModelInfoComponent>;
  let stateServiceStubbed: StateService;
  const router = new BehaviorSubject({
    name: 'miniModel',
  });

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ HeaderModelComponent, ModelDropdownComponent, ModelInfoComponent, DismissibleHelpDialogComponent ],
      imports: [ DismissibleHelpModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: router.asObservable() } },
        { provide: NgbModal, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelInfoComponent);
    component = fixture.componentInstance;
    component.models = fromJS([]);
    component.userState = fromJS({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('switching between models', () => {
      it('loads bsc', () => {
        router.next({ name: 'bsc' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(11);
      });

      it('loads the miniModel', () => {
        router.next({ name: 'miniModel' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('div.entity-row').length).toEqual(6);
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('unsubscribes from the routes service', () => {
      spyOn(component.routeSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('toggleAttributes', () => {
    it('starts the expansion map as true', () => {
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeTruthy();
    });

    it('can switch an expanded node to false', () => {
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeFalsy();
    });

    it('can switch an unexpanded node to true', () => {
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      component.toggleAttributes(0);
      expect(component.expanded[0]).toBeTruthy();
    });
  });
});
