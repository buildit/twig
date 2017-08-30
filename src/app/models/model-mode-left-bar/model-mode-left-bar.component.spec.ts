import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { ModelDetailsComponent } from './../model-details/model-details.component';
import { ModelModeLeftBarComponent } from './model-mode-left-bar.component';

describe('ModelModeLeftBarComponent', () => {
  let component: ModelModeLeftBarComponent;
  let fixture: ComponentFixture<ModelModeLeftBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModelDetailsComponent,
        ModelModeLeftBarComponent
      ],
      imports: [ NgbAccordionModule ],
      providers: [ NgbAccordionConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelModeLeftBarComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: false
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
