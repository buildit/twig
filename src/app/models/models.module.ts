import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { CloneModelModalComponent } from './clone-model-modal/clone-model-modal.component';
import { CreateModelModalComponent } from './create-model-modal/create-model-modal.component';
import { EditModelDetailsComponent } from './edit-model-details/edit-model-details.component';
import { HeaderModelComponent } from './header-model/header-model.component';
import { HeaderModelEditComponent } from './header-model-edit/header-model-edit.component';
import { ModelDropdownComponent } from './model-dropdown/model-dropdown.component';
import { ModelFormComponent } from './model-form/model-form.component';
import { ModelInfoComponent } from './model-info/model-info.component';
import { ModelViewComponent } from './model-view/model-view.component';
import { router } from './../app.router';
import { SharedModule } from './../shared/shared.module';

@NgModule({
    declarations: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        EditModelDetailsComponent,
        HeaderModelComponent,
        HeaderModelEditComponent,
        ModelDropdownComponent,
        ModelFormComponent,
        ModelInfoComponent,
        ModelViewComponent,
    ],
    entryComponents: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        EditModelDetailsComponent,
    ],
    exports: [
        CloneModelModalComponent,
        CreateModelModalComponent,
        EditModelDetailsComponent,
        HeaderModelComponent,
        HeaderModelEditComponent,
        ModelDropdownComponent,
        ModelFormComponent,
        ModelInfoComponent,
        ModelViewComponent,
    ],
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        router,
        SharedModule,
        ToastModule.forRoot(),
    ],
})
export class ModelsModule {
}
