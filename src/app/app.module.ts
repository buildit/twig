import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { ModelsModule } from './models/models.module';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { router } from './app.router';
import { StateService } from './state.service';
import { TwigletsModule } from './twiglets/twiglets.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    ModelsModule,
    NgbModule.forRoot(),
    router,
    ToastModule.forRoot(),
    TwigletsModule
  ],
  providers: [StateService],
})
export class AppModule { }
