import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Autosize } from 'angular2-autosize/angular2-autosize';
import { D3Service } from 'd3-ng2-service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { AboutEventAndSeqModalComponent } from './about-event-and-seq-modal/about-event-and-seq-modal.component';
import { AboutTwigletModalComponent } from './about-twiglet-modal/about-twiglet-modal.component';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { EditEventsAndSeqModalComponent } from './edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { EditGravityPointModalComponent } from './edit-gravity-point-modal/edit-gravity-point-modal.component';
import { EditLinkModalComponent } from './edit-link-modal/edit-link-modal.component';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { EnvironmentControlsComponent } from './environment-controls/environment-controls.component';
import { EventsListComponent } from './events-list/events-list.component';
import { GravityListComponent } from './gravity-list/gravity-list.component';
import { HeaderTwigletComponent } from './header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './header-twiglet-edit/header-twiglet-edit.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { RenameTwigletModalComponent } from './rename-twiglet-modal/rename-twiglet-modal.component';
import { router } from './../app.router';
import { SequenceDropdownComponent } from './sequence-dropdown/sequence-dropdown.component';
import { SharedModule } from './../shared/shared.module';
import { SimulationControlsComponent } from './simulation-controls/simulation-controls.component';
import { TwigletDetailsComponent } from './twiglet-details/twiglet-details.component';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';
import { TwigletEventsComponent } from './twiglet-events/twiglet-events.component';
import { TwigletFiltersComponent } from './twiglet-filters/twiglet-filters.component';
import { TwigletFilterTargetComponent } from './twiglet-filter-target/twiglet-filter-target.component';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { TwigletHomeComponent } from './twiglet-home/twiglet-home.component';
import { TwigletModeLeftBarComponent } from './twiglet-mode-left-bar/twiglet-mode-left-bar.component';
import { TwigletModelViewComponent } from './twiglet-model-view/twiglet-model-view.component';
import { TwigletNodeGroupComponent } from './twiglet-node-group/twiglet-node-group.component';
import { TwigletNodeListComponent } from './twiglet-node-list/twiglet-node-list.component';
import { TwigletViewsComponent } from './twiglet-views/twiglet-views.component';
import { ViewListComponent } from './view-list/view-list.component';
import { ViewsSaveModalComponent } from './views-save-modal/views-save-modal.component';

@NgModule({
    declarations: [
        AboutEventAndSeqModalComponent,
        AboutTwigletModalComponent,
        AddNodeByDraggingButtonComponent,
        Autosize,
        CopyPasteNodeComponent,
        CreateTwigletModalComponent,
        EditEventsAndSeqModalComponent,
        EditGravityPointModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EnvironmentControlsComponent,
        EventsListComponent,
        GravityListComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        NodeInfoComponent,
        RenameTwigletModalComponent,
        SequenceDropdownComponent,
        SimulationControlsComponent,
        TwigletDetailsComponent,
        TwigletDropdownComponent,
        TwigletEventsComponent,
        TwigletFiltersComponent,
        TwigletFilterTargetComponent,
        TwigletGraphComponent,
        TwigletHomeComponent,
        TwigletModeLeftBarComponent,
        TwigletModelViewComponent,
        TwigletNodeGroupComponent,
        TwigletNodeListComponent,
        TwigletViewsComponent,
        ViewListComponent,
        ViewsSaveModalComponent,
    ],
    entryComponents: [
        AboutEventAndSeqModalComponent,
        AboutTwigletModalComponent,
        CreateTwigletModalComponent,
        EditEventsAndSeqModalComponent,
        EditGravityPointModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        RenameTwigletModalComponent,
        ViewsSaveModalComponent,
    ],
    exports: [
        AddNodeByDraggingButtonComponent,
        RenameTwigletModalComponent,
        EnvironmentControlsComponent,
        EventsListComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        SequenceDropdownComponent,
        SimulationControlsComponent,
        TwigletDropdownComponent,
        TwigletEventsComponent,
        TwigletFiltersComponent,
        TwigletGraphComponent,
        TwigletModeLeftBarComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
        TwigletViewsComponent,
        ViewListComponent,
        ViewsSaveModalComponent,
    ],
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        router,
        SharedModule,
        ToastModule.forRoot(),
    ],
})
export class TwigletsModule { }
