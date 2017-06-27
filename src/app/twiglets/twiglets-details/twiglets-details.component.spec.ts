import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigletsDetailsComponent } from './twiglets-details.component';

describe('TwigletsDetailsComponent', () => {
  let component: TwigletsDetailsComponent;
  let fixture: ComponentFixture<TwigletsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
