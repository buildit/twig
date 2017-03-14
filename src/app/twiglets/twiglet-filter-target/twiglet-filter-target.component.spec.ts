import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigletFilterTargetComponent } from './twiglet-filter-target.component';

describe('TwigletFilterTargetComponent', () => {
  let component: TwigletFilterTargetComponent;
  let fixture: ComponentFixture<TwigletFilterTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletFilterTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFilterTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
