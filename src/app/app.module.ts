import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';


import { AppComponent } from './app.component';
import { D3Service } from 'd3-ng2-service';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { ListOfNodesComponent } from './list-of-nodes/list-of-nodes.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { EditTwigletControlsComponent } from './edit-twiglet-controls/edit-twiglet-controls.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { NavigationViewComponent } from './navigation-view/navigation-view.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TwigletGraphComponent,
    ImmutableMapOfMapsPipe,
    ListOfNodesComponent,
    NodeInfoComponent,
    EditTwigletControlsComponent,
    HeaderComponent,
    FooterComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    NavigationViewComponent,
    FontAwesomeToggleButtonComponent,
  ],
  imports: [
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [StateService],
})
export class AppModule { }
