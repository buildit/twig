import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { PingComponent } from './ping/ping.component';
import { PingService } from './ping/ping.service';
import { router } from './../app.router';
import { SharedModule } from './../shared/shared.module';
import { SplashComponent } from './splash/splash.component';


@NgModule({
    declarations: [
        HeaderInfoBarComponent,
        LoginButtonComponent,
        LoginModalComponent,
        SplashComponent,
        PingComponent,
    ],
    entryComponents: [
        LoginModalComponent,
        PingComponent
    ],
    exports: [
        HeaderInfoBarComponent,
        LoginButtonComponent,
        LoginModalComponent,
        SplashComponent,
    ],
    imports: [
        CommonModule,
        Ng2PageScrollModule.forRoot(),
        NgbModule.forRoot(),
        router,
        SharedModule,
        ToastModule.forRoot(),
    ],
    providers: [ PingService ]
})
export class CoreModule { }
