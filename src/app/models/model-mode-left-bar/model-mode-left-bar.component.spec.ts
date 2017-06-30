import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelModeLeftBarComponent } from './model-mode-left-bar.component';

describe('ModelModeLeftBarComponent', () => {
  let component: ModelModeLeftBarComponent;
  let fixture: ComponentFixture<ModelModeLeftBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelModeLeftBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelModeLeftBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
