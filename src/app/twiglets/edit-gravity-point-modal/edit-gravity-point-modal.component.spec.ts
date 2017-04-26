import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGravityPointModalComponent } from './edit-gravity-point-modal.component';

describe('EditGravityPointModalComponent', () => {
  let component: EditGravityPointModalComponent;
  let fixture: ComponentFixture<EditGravityPointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGravityPointModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGravityPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
