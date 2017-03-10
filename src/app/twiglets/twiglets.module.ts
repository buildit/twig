import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { EditLinkModalComponent } from './edit-link-modal/edit-link-modal.component';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { EditTwigletDetailsComponent } from './edit-twiglet-details/edit-twiglet-details.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { HeaderTwigletComponent } from './header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './header-twiglet-edit/header-twiglet-edit.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { router } from './../app.router';
import { SharedModule } from './../shared/shared.module';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';
import { TwigletFiltersComponent } from './twiglet-filters/twiglet-filters.component';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { TwigletModelViewComponent } from './twiglet-model-view/twiglet-model-view.component';
import { TwigletNodeListComponent } from './twiglet-node-list/twiglet-node-list.component';
import { ViewDropdownComponent } from './view-dropdown/view-dropdown.component';
import { ViewsSaveModalComponent } from './views-save-modal/views-save-modal.component';

@NgModule({
    declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        CreateTwigletModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EditTwigletDetailsComponent,
        HeaderEnvironmentComponent,
        HeaderSimulationControlsComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        HeaderViewComponent,
        NodeInfoComponent,
        TwigletDropdownComponent,
        TwigletFiltersComponent,
        TwigletGraphComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
        ViewDropdownComponent,
        ViewsSaveModalComponent,
    ],
    entryComponents: [
        CreateTwigletModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EditTwigletDetailsComponent,
        ViewsSaveModalComponent,
    ],
    exports: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        CreateTwigletModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EditTwigletDetailsComponent,
        HeaderEnvironmentComponent,
        HeaderSimulationControlsComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        HeaderViewComponent,
        NodeInfoComponent,
        TwigletDropdownComponent,
        TwigletFiltersComponent,
        TwigletGraphComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
        ViewDropdownComponent,
        ViewsSaveModalComponent,
    ],
    imports: [
        CommonModule,
        Ng2PageScrollModule.forRoot(),
        NgbModule.forRoot(),
        router,
        SharedModule,
        ToastModule.forRoot(),
    ],
})
export class TwigletsModule { }
