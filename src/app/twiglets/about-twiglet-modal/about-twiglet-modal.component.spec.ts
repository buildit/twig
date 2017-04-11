import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTwigletModalComponent } from './about-twiglet-modal.component';

describe('AboutTwigletModalComponent', () => {
  let component: AboutTwigletModalComponent;
  let fixture: ComponentFixture<AboutTwigletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTwigletModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTwigletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
