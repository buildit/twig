/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ModelInfoComponent } from './model-info.component';
import { routerForTesting } from './../app.router';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('ModelInfoComponent', () => {
  let component: ModelInfoComponent;
  let fixture: ComponentFixture<ModelInfoComponent>;
  let stateServiceStubbed: StateService;
  let router = new BehaviorSubject({
    id: 'miniModel',
  });

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ModelInfoComponent ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: router.asObservable() } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('switching between models', () => {
      it('loads bsc', () => {
        router.next({ id: 'bsc' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(12);
      });

      it('loads the miniModel', () => {
        router.next({ id: 'miniModel' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(6);
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
});
