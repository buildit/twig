import { KeyValuesPipe } from './../key-values.pipe';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbTabsetModule, NgbTabsetConfig, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header.component';
import { StateService, StateServiceStub } from './../state.service';
import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { FontAwesomeToggleButtonComponent } from './../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderEditComponent } from './../header-edit/header-edit.component';
import { HeaderInfoBarComponent } from './../header-info-bar/header-info-bar.component';
import { HeaderViewComponent } from './../header-view/header-view.component';
import { HeaderEnvironmentComponent } from './../header-environment/header-environment.component';
import { HeaderSimulationControlsComponent } from './../header-simulation-controls/header-simulation-controls.component';
import { SliderWithLabelComponent } from './../slider-with-label/slider-with-label.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        FontAwesomeToggleButtonComponent,
        HeaderComponent,
        HeaderInfoBarComponent,
        HeaderEditComponent,
        HeaderViewComponent,
        HeaderEnvironmentComponent,
        HeaderSimulationControlsComponent,
        KeyValuesPipe,
        SliderWithLabelComponent,
      ],
      imports: [ NgbTabsetModule, NgbTooltipModule, FormsModule ],
      providers: [ NgbTabsetConfig, NgbTooltipConfig, { provide: StateService, useValue: new StateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
