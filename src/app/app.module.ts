import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RouterModule, Router } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';

import 'hammerjs';

import { router } from './app.router';

import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { AppComponent } from './app.component';
import { ChangelogListComponent } from './changelog-list/changelog-list.component';
import { CloneModelModalComponent } from './clone-model-modal/clone-model-modal.component';
import { CommitModalComponent } from './commit-modal/commit-modal.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { D3Service } from 'd3-ng2-service';
import { DeleteModelConfirmationComponent } from './delete-model-confirmation/delete-model-confirmation.component';
import { DeleteTwigletConfirmationComponent } from './delete-twiglet-confirmation/delete-twiglet-confirmation.component';
import { EditLinkModalComponent } from './edit-link-modal/edit-link-modal.component';
import { EditModeButtonComponent } from './edit-mode-button/edit-mode-button.component';
import { EditModelDetailsComponent } from './edit-model-details/edit-model-details.component';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { EditTwigletDetailsComponent } from './edit-twiglet-details/edit-twiglet-details.component';
import { FilterEntitiesPipe } from './filter-entities.pipe';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FontAwesomeIconPickerComponent } from './font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { FooterComponent } from './footer/footer.component';
import { FormControlsSortPipe } from './form-controls-sort.pipe';
import { HeaderComponent } from './header/header.component';
import { HeaderEditComponent } from './header-edit/header-edit.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { HeaderModelComponent } from './header-model/header-model.component';
import { HeaderModelEditComponent } from './header-model-edit/header-model-edit.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { KeyValuesPipe } from './key-values.pipe';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { ModelDropdownComponent } from './model-dropdown/model-dropdown.component';
import { ModelEditButtonComponent } from './model-edit-button/model-edit-button.component';
import { ModelFormComponent } from './model-form/model-form.component';
import { ModelInfoComponent } from './model-info/model-info.component';
import { ModelViewComponent } from './model-view/model-view.component';
import { NewModelModalComponent } from './new-model-modal/new-model-modal.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { NodeSearchPipe } from './node-search.pipe';
import { ObjectSortPipe } from './object-sort.pipe';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { PrimitiveArraySortPipe } from './primitive-array-sort.pipe';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { HeaderTwigletComponent } from './header-twiglet/header-twiglet.component';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { SplashComponent } from './splash/splash.component';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';
import { TwigletRightSideBarComponent } from './twiglet-right-sidebar/twiglet-right-sidebar.component';
import { OverwriteDialogComponent } from './overwrite-dialog/overwrite-dialog.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AddNodeByDraggingButtonComponent,
    AppComponent,
    ChangelogListComponent,
    CloneModelModalComponent,
    CopyPasteNodeComponent,
    CommitModalComponent,
    CreateTwigletModalComponent,
    DeleteModelConfirmationComponent,
    DeleteTwigletConfirmationComponent,
    EditLinkModalComponent,
    EditModeButtonComponent,
    EditModelDetailsComponent,
    EditNodeModalComponent,
    EditTwigletDetailsComponent,
    FilterEntitiesPipe,
    FilterMenuComponent,
    FontAwesomeIconPickerComponent,
    FontAwesomeToggleButtonComponent,
    FooterComponent,
    FormControlsSortPipe,
    HeaderComponent,
    HeaderEditComponent,
    HeaderEnvironmentComponent,
    HeaderInfoBarComponent,
    HeaderModelComponent,
    HeaderModelEditComponent,
    HeaderSimulationControlsComponent,
    HeaderTwigletComponent,
    HeaderViewComponent,
    ImmutableMapOfMapsPipe,
    KeyValuesPipe,
    LeftSideBarComponent,
    LoginButtonComponent,
    LoginModalComponent,
    ModelDropdownComponent,
    ModelEditButtonComponent,
    ModelFormComponent,
    ModelInfoComponent,
    ModelViewComponent,
    NodeInfoComponent,
    NodeSearchPipe,
    NewModelModalComponent,
    ObjectToArrayPipe,
    ObjectSortPipe,
    PrimitiveArraySortPipe,
    RightSideBarComponent,
    SliderWithLabelComponent,
    SplashComponent,
    TwigletGraphComponent,
    TwigletDropdownComponent,
    TwigletRightSideBarComponent,
    OverwriteDialogComponent,
  ],
  entryComponents: [
    CloneModelModalComponent,
    CommitModalComponent,
    CreateTwigletModalComponent,
    DeleteModelConfirmationComponent,
    DeleteTwigletConfirmationComponent,
    EditLinkModalComponent,
    EditNodeModalComponent,
    EditTwigletDetailsComponent,
    LoginModalComponent,
    OverwriteDialogComponent,
    NewModelModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2PageScrollModule.forRoot(),
    NgbModule.forRoot(),
    ReactiveFormsModule,
    router,
    ToastModule.forRoot({}),
    TrimValueAccessorModule,
  ],
  providers: [DatePipe, StateService],
})
export class AppModule { }
