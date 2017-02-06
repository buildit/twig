/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModelInfoComponent } from './model-info.component';
import { routerForTesting } from './../app.router';

describe('ModelInfoComponent', () => {
  let component: ModelInfoComponent;
  let fixture: ComponentFixture<ModelInfoComponent>;
  let router = new BehaviorSubject({
    id: 'miniModel',
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelInfoComponent ],
      providers: [
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
});
