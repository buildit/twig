import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSequenceModalComponent } from './edit-sequence-modal.component';

describe('EditSequenceModalComponent', () => {
  let component: EditSequenceModalComponent;
  let fixture: ComponentFixture<EditSequenceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSequenceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSequenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
