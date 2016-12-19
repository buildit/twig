import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { D3Service } from 'd3-ng2-service';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { ListOfNodesComponent } from './list-of-nodes/list-of-nodes.component';
import { NodeInfoComponent } from './node-info/node-info.component'; // <-- import statement

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TwigletGraphComponent,
    ImmutableMapOfMapsPipe,
    ListOfNodesComponent,
    NodeInfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [StateService],
})
export class AppModule { }
