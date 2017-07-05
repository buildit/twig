import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { AboutComponent } from './about/about.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { router } from './../app.router';
import { SharedModule } from './../shared/shared.module';
import { SplashComponent } from './splash/splash.component';


@NgModule({
  declarations: [
    AboutComponent,
    HeaderInfoBarComponent,
    LoginButtonComponent,
    LoginModalComponent,
    SplashComponent,
  ],
  entryComponents: [
    LoginModalComponent,
  ],
  exports: [
    HeaderInfoBarComponent,
    LoginButtonComponent,
    LoginModalComponent,
    SplashComponent,
  ],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    router,
    SharedModule,
    ToastModule.forRoot(),
  ],
})
export class CoreModule { }
