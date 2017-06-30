import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigletHomeComponent } from './twiglet-home.component';

describe('TwigletHomeComponent', () => {
  let component: TwigletHomeComponent;
  let fixture: ComponentFixture<TwigletHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
