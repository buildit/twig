import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismissibleHelpDialogComponent } from './dismissible-help-dialog.component';

describe('DismissibleHelpDialogComponent', () => {
  let component: DismissibleHelpDialogComponent;
  let fixture: ComponentFixture<DismissibleHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismissibleHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismissibleHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
