import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { EditModeButtonComponent } from './../edit-mode-button/edit-mode-button.component';
import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { FontAwesomeToggleButtonComponent } from '../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { KeyValuesPipe } from '../key-values.pipe';
import { StateService } from '../state.service';
import { stateServiceStub, fullTwigletModelMap, fullTwigletMap, twigletsList } from '../../non-angular/testHelpers';
import { HeaderEditComponent } from './header-edit.component';

describe('HeaderEditComponent', () => {
  let component: HeaderEditComponent;
  let fixture: ComponentFixture<HeaderEditComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        EditModeButtonComponent,
        EditTwigletDetailsComponent,
        FontAwesomeToggleButtonComponent,
        HeaderEditComponent,
        KeyValuesPipe,
      ],
      imports: [
        NgbTooltipModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        NgbTooltipConfig,
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEditComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: true,
    });
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    component.twiglets = twigletsList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the correct number of icons in edit mode', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-add-node-by-dragging-button').length).toEqual(6);
  });
});
