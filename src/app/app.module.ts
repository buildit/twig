import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { D3Service } from 'd3-ng2-service';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component'; // <-- import statement

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TwigletGraphComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [StateService],
})
export class AppModule { }
