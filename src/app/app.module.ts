import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RouterModule, Router } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { router } from './app.router';

import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { AppComponent } from './app.component';
import { CommitModalComponent } from './commit-modal/commit-modal.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { D3Service } from 'd3-ng2-service';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { FilterEntitiesPipe } from './filter-entities.pipe';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HeaderEditComponent } from './header-edit/header-edit.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { KeyValuesPipe } from './key-values.pipe';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { NodeSearchPipe } from './node-search.pipe';
import { NodeSortPipe } from './node-sort.pipe';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { HeaderServerComponent } from './header-server/header-server.component';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { SplashComponent } from './splash/splash.component';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AddNodeByDraggingButtonComponent,
    AppComponent,
    CopyPasteNodeComponent,
    CommitModalComponent,
    CreateTwigletModalComponent,
    EditNodeModalComponent,
    FilterEntitiesPipe,
    FilterMenuComponent,
    FontAwesomeToggleButtonComponent,
    FooterComponent,
    HeaderComponent,
    HeaderEditComponent,
    HeaderEnvironmentComponent,
    HeaderInfoBarComponent,
    HeaderServerComponent,
    HeaderSimulationControlsComponent,
    HeaderViewComponent,
    ImmutableMapOfMapsPipe,
    KeyValuesPipe,
    LeftSideBarComponent,
    LoginButtonComponent,
    LoginModalComponent,
    NodeInfoComponent,
    NodeSearchPipe,
    NodeSortPipe,
    RightSideBarComponent,
    SliderWithLabelComponent,
    SplashComponent,
    TwigletGraphComponent,
    TwigletDropdownComponent,
  ],
  entryComponents: [
    CommitModalComponent,
    EditNodeModalComponent,
    LoginModalComponent,
    CreateTwigletModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2PageScrollModule.forRoot(),
    NgbModule.forRoot(),
    ReactiveFormsModule,
    router,
    ToastModule,
  ],
  providers: [StateService],
})
export class AppModule { }
