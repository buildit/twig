import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventsModalComponent } from './create-events-modal.component';

describe('CreateEventsModalComponent', () => {
  let component: CreateEventsModalComponent;
  let fixture: ComponentFixture<CreateEventsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEventsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
