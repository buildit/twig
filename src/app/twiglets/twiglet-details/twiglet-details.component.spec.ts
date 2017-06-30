import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigletDetailsComponent } from './twiglet-details.component';

describe('TwigletsDetailsComponent', () => {
  let component: TwigletDetailsComponent;
  let fixture: ComponentFixture<TwigletDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
