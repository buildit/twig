/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TwigletModelViewComponent } from './twiglet-model-view.component';

describe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
