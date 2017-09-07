import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { HeaderTwigletEditComponent } from './header-twiglet-edit.component';
import { KeyValuesPipe } from '../../shared/pipes/key-values.pipe';
import { RenameTwigletModalComponent } from './../rename-twiglet-modal/rename-twiglet-modal.component';
import { StateService } from '../../state.service';
import { ToggleButtonComponent } from '../../shared/toggle-button/toggle-button.component';

describe('HeaderTwigletEditComponent', () => {
  let component: HeaderTwigletEditComponent;
  let fixture: ComponentFixture<HeaderTwigletEditComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        HeaderTwigletEditComponent,
        KeyValuesPipe,
        RenameTwigletModalComponent,
        ToggleButtonComponent,
      ],
      imports: [
        FormsModule,
        NgbModule.forRoot(),
        NgbTooltipModule,
        ReactiveFormsModule,
      ],
      providers: [
        NgbModal,
        NgbTooltipConfig,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTwigletEditComponent);
    component = fixture.componentInstance;
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    component.twiglets = twigletsList();
  });

  it('should create', () => {
    component.userState = Map({
      isEditing: true,
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('does not display anything if the model is being edited', () => {
    component.userState = Map({
      editTwigletModel: true,
      isEditing: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div.nodes-wrap')).toBeFalsy();
  });

  it('only displays if the model is not being edited', () => {
    component.userState = Map({
      editTwigletModel: false,
      isEditing: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div.nodes-wrap')).toBeTruthy();
  });

  it('displays the correct number of icons in edit mode', () => {
    component.userState = Map({
      editTwigletModel: false,
      isEditing: true,
    });
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-add-node-by-dragging-button').length).toEqual(6);
  });
});
