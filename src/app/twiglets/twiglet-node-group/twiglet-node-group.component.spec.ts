import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigletNodeGroupComponent } from './twiglet-node-group.component';

describe('TwigletNodeGroupComponent', () => {
  let component: TwigletNodeGroupComponent;
  let fixture: ComponentFixture<TwigletNodeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletNodeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletNodeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
