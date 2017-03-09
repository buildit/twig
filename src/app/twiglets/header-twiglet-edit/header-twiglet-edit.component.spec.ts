import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { EditModeButtonComponent } from './../../shared/edit-mode-button/edit-mode-button.component';
import { FontAwesomeToggleButtonComponent } from '../../shared/font-awesome-toggle-button/font-awesome-toggle-button.component';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { HeaderTwigletEditComponent } from './header-twiglet-edit.component';
import { KeyValuesPipe } from '../../shared/key-values.pipe';
import { StateService } from '../../state.service';

describe('HeaderTwigletEditComponent', () => {
  let component: HeaderTwigletEditComponent;
  let fixture: ComponentFixture<HeaderTwigletEditComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        EditModeButtonComponent,
        EditTwigletDetailsComponent,
        FontAwesomeToggleButtonComponent,
        HeaderTwigletEditComponent,
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
    fixture = TestBed.createComponent(HeaderTwigletEditComponent);
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
