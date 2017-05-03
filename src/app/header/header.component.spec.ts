import { SequenceDropdownComponent } from './../twiglets/sequence-dropdown/sequence-dropdown.component';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTabsetConfig, NgbTabsetModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { Model } from './../../non-angular/interfaces/model/index';
import { KeyValuesPipe } from './../shared/pipes/key-values.pipe';
import { PrimitiveArraySortPipe } from './../shared/pipes/primitive-array-sort.pipe';
import { routerForTesting } from './../app.router';
import { SortImmutablePipe } from './../shared/pipes/sort-immutable.pipe';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

import { AddGravityPointToggleComponent } from './../twiglets/add-gravity-point-toggle/add-gravity-point-toggle.component';
import { AddNodeByDraggingButtonComponent } from './../twiglets/add-node-by-dragging-button/add-node-by-dragging-button.component';
import { ChangelogListComponent } from './../shared/changelog-list/changelog-list.component';
import { CopyPasteNodeComponent } from './../twiglets/copy-paste-node/copy-paste-node.component';
import { EditModeButtonComponent } from './../shared/edit-mode-button/edit-mode-button.component';
import { EditModelDetailsComponent } from './../models/edit-model-details/edit-model-details.component';
import { EditTwigletDetailsComponent } from './../twiglets/edit-twiglet-details/edit-twiglet-details.component';
import { FontAwesomeToggleButtonComponent } from './../shared/font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderComponent } from './header.component';
import { HeaderEnvironmentComponent } from './../twiglets/header-environment/header-environment.component';
import { HeaderEventsComponent } from './../twiglets/header-events/header-events.component';
import { HeaderInfoBarComponent } from './../core/header-info-bar/header-info-bar.component';
import { HeaderModelComponent } from '../models/header-model/header-model.component';
import { HeaderModelEditComponent } from './../models/header-model-edit/header-model-edit.component';
import { HeaderSimulationControlsComponent } from './../twiglets/header-simulation-controls/header-simulation-controls.component';
import { HeaderTwigletComponent } from './../twiglets/header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../twiglets/header-twiglet-edit/header-twiglet-edit.component';
import { HeaderViewComponent } from './../twiglets/header-view/header-view.component';
import { LoginButtonComponent } from './../core/login-button/login-button.component';
import { ModelDropdownComponent } from './../models/model-dropdown/model-dropdown.component';
import { SliderWithLabelComponent } from './../shared/slider-with-label/slider-with-label.component';
import { TwigletDropdownComponent } from './../twiglets/twiglet-dropdown/twiglet-dropdown.component';
import { ViewDropdownComponent } from './../twiglets/view-dropdown/view-dropdown.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddGravityPointToggleComponent,
        AddNodeByDraggingButtonComponent,
        ChangelogListComponent,
        CopyPasteNodeComponent,
        EditModeButtonComponent,
        EditModelDetailsComponent,
        EditTwigletDetailsComponent,
        FontAwesomeToggleButtonComponent,
        HeaderComponent,
        HeaderEnvironmentComponent,
        HeaderEventsComponent,
        HeaderInfoBarComponent,
        HeaderModelComponent,
        HeaderModelEditComponent,
        HeaderSimulationControlsComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        HeaderViewComponent,
        KeyValuesPipe,
        LoginButtonComponent,
        ModelDropdownComponent,
        PrimitiveArraySortPipe,
        SequenceDropdownComponent,
        SliderWithLabelComponent,
        SortImmutablePipe,
        TwigletDropdownComponent,
        ViewDropdownComponent,
      ],
      imports: [
        NgbTabsetModule,
        NgbTooltipModule,
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        NgbTabsetConfig,
        NgbTooltipConfig,
        NgbModal,
        ToastsManager,
        ToastOptions,
        { provide: StateService, useValue: stateServiceStub()},
        { provide: Router, useValue: { events: Observable.of() } } ]
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
