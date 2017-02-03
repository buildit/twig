import { PrimitiveArraySortPipe } from './../primitive-array-sort.pipe';
import { Observable } from 'rxjs';
import { Model } from './../../non-angular/interfaces/model/index';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTabsetModule, NgbTabsetConfig, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { List } from 'immutable';

import { routerForTesting } from './../app.router';
import { KeyValuesPipe } from './../key-values.pipe';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { ChangelogListComponent } from './../changelog-list/changelog-list.component';
import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { FontAwesomeToggleButtonComponent } from './../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderComponent } from './header.component';
import { HeaderEditComponent } from './../header-edit/header-edit.component';
import { HeaderEnvironmentComponent } from './../header-environment/header-environment.component';
import { HeaderInfoBarComponent } from './../header-info-bar/header-info-bar.component';
import { HeaderModelComponent } from '../header-model/header-model.component';
import { HeaderSimulationControlsComponent } from './../header-simulation-controls/header-simulation-controls.component';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderViewComponent } from './../header-view/header-view.component';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { ModelDropdownComponent } from './../model-dropdown/model-dropdown.component';
import { SliderWithLabelComponent } from './../slider-with-label/slider-with-label.component';
import { StateService } from './../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { TwigletDropdownComponent } from '../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletEditButtonComponent } from './../twiglet-edit-button/twiglet-edit-button.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        ChangelogListComponent,
        CopyPasteNodeComponent,
        EditTwigletDetailsComponent,
        FilterMenuComponent,
        FontAwesomeToggleButtonComponent,
        HeaderComponent,
        HeaderEditComponent,
        HeaderEnvironmentComponent,
        HeaderInfoBarComponent,
        HeaderModelComponent,
        HeaderSimulationControlsComponent,
        HeaderTwigletComponent,
        HeaderViewComponent,
        KeyValuesPipe,
        LoginButtonComponent,
        ModelDropdownComponent,
        PrimitiveArraySortPipe,
        SliderWithLabelComponent,
        TwigletDropdownComponent,
        TwigletEditButtonComponent,
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
