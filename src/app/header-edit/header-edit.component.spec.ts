/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { FontAwesomeToggleButtonComponent } from '../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { KeyValuesPipe } from '../key-values.pipe';
import { StateService, StateServiceStub } from '../state.service';
import { HeaderEditComponent } from './header-edit.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('HeaderEditComponent', () => {
  let component: HeaderEditComponent;
  let fixture: ComponentFixture<HeaderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CopyPasteNodeComponent,
        HeaderEditComponent,
        FontAwesomeToggleButtonComponent,
        AddNodeByDraggingButtonComponent,
        KeyValuesPipe,
      ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ],
      providers: [ NgbTooltipConfig, NgbModal, { provide: StateService, useValue: new StateServiceStub()} ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
