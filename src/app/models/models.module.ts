import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import 'hammerjs';

import { CloneModelModalComponent } from './clone-model-modal/clone-model-modal.component';
import { CreateModelModalComponent } from './create-model-modal/create-model-modal.component';
import { HeaderModelComponent } from './header-model/header-model.component';
import { ModelDetailsComponent } from './model-details/model-details.component';
import { ModelDropdownComponent } from './model-dropdown/model-dropdown.component';
import { ModelFormComponent } from './model-form/model-form.component';
import { ModelHomeComponent } from './model-home/model-home.component';
import { ModelInfoComponent } from './model-info/model-info.component';
import { ModelModeLeftBarComponent } from './model-mode-left-bar/model-mode-left-bar.component';
import { ModelViewComponent } from './model-view/model-view.component';
import { RenameModelModalComponent } from './rename-model-modal/rename-model-modal.component';
import { router } from './../app.router';
import { SharedModule } from './../shared/shared.module';
import { DismissibleHelpModule } from '../directives/dismissible-help/dismissible-help.module';

@NgModule({
    declarations: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        HeaderModelComponent,
        ModelDetailsComponent,
        ModelDropdownComponent,
        ModelFormComponent,
        ModelHomeComponent,
        ModelInfoComponent,
        ModelModeLeftBarComponent,
        ModelViewComponent,
        RenameModelModalComponent,
    ],
    entryComponents: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        RenameModelModalComponent,
    ],
    exports: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        HeaderModelComponent,
        ModelDropdownComponent,
        ModelFormComponent,
        ModelInfoComponent,
        ModelModeLeftBarComponent,
        ModelViewComponent,
        RenameModelModalComponent,
    ],
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        DismissibleHelpModule.forRoot(),
        router,
        SharedModule,
        ToastrModule.forRoot(),
    ],
})
export class ModelsModule {
}
