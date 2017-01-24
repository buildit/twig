import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RouterModule, Router } from '@angular/router';
import 'hammerjs';

import { router } from './app.router';

import { AppComponent } from './app.component';
import { D3Service } from 'd3-ng2-service';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './node-info/node-info.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { HeaderEditComponent } from './header-edit/header-edit.component';
import { KeyValuesPipe } from './key-values.pipe';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { NodeSearchPipe } from './node-search.pipe';
import { NodeSortPipe } from './node-sort.pipe';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FilterEntitiesPipe } from './filter-entities.pipe';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';
import { TwigletModalComponent } from './twiglet-modal/twiglet-modal.component';
<<<<<<< HEAD
import { SplashComponent } from './splash/splash.component';
=======
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
>>>>>>> 257ad15a07eee579a3ff5045b267ac2c11a5ecb0

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TwigletGraphComponent,
    ImmutableMapOfMapsPipe,
    NodeInfoComponent,
    HeaderComponent,
    FooterComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    HeaderViewComponent,
    FontAwesomeToggleButtonComponent,
    HeaderEditComponent,
    KeyValuesPipe,
    AddNodeByDraggingButtonComponent,
    HeaderInfoBarComponent,
    NodeSearchPipe,
    NodeSortPipe,
    EditNodeModalComponent,
    HeaderEnvironmentComponent,
    CopyPasteNodeComponent,
    HeaderSimulationControlsComponent,
    SliderWithLabelComponent,
    FilterMenuComponent,
    FilterEntitiesPipe,
    TwigletDropdownComponent,
    TwigletModalComponent,
<<<<<<< HEAD
    SplashComponent,
=======
    LoginButtonComponent,
    LoginModalComponent,
>>>>>>> 257ad15a07eee579a3ff5045b267ac2c11a5ecb0
  ],
  entryComponents: [
    EditNodeModalComponent,
    LoginModalComponent,
    TwigletModalComponent,
  ],
  imports: [
    Ng2PageScrollModule.forRoot(),
    NgbModule.forRoot(),
    router,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
  ],
  providers: [StateService],
})
export class AppModule { }
