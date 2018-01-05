import { DismissibleHelpModule } from './../directives/dismissible-help/dismissible-help.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Autosize } from 'ng-autosize/src/autosize.directive';
import { BoundSensorModule } from 'bound-sensor';
import { D3Service } from 'd3-ng2-service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import 'hammerjs';

import { AboutEventAndSeqModalComponent } from './about-event-and-seq-modal/about-event-and-seq-modal.component';
import { AboutTwigletModalComponent } from './about-twiglet-modal/about-twiglet-modal.component';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { EditGravityPointModalComponent } from './edit-gravity-point-modal/edit-gravity-point-modal.component';
import { EditLinkModalComponent } from './edit-link-modal/edit-link-modal.component';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { EditSequenceModalComponent } from './edit-sequence-modal/edit-sequence-modal.component';
import { EnvironmentControlsComponent } from './environment-controls/environment-controls.component';
import { EventsListComponent } from './events-list/events-list.component';
import { GravityListComponent } from './gravity-list/gravity-list.component';
import { HeaderTwigletComponent } from './header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './header-twiglet-edit/header-twiglet-edit.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { RenameTwigletModalComponent } from './rename-twiglet-modal/rename-twiglet-modal.component';
import { router } from './../app.router';
import { SequenceListComponent } from './sequence-list/sequence-list.component';
import { SharedModule } from './../shared/shared.module';
import { SplashComponent } from './splash/splash.component';
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
import { ViewsSaveModalComponent } from './views-save-modal/views-save-modal.component';
import { ViewDropdownComponent } from './view-dropdown/view-dropdown.component';
import { BreadcrumbNavigationComponent } from './breadcrumb-navigation/breadcrumb-navigation.component';
import { TwigletGravityComponent } from './twiglet-gravity/twiglet-gravity.component';


@NgModule({
    declarations: [
        AboutEventAndSeqModalComponent,
        AboutTwigletModalComponent,
        AddNodeByDraggingButtonComponent,
        Autosize,
        CopyPasteNodeComponent,
        CreateEventModalComponent,
        CreateTwigletModalComponent,
        EditGravityPointModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EditSequenceModalComponent,
        EnvironmentControlsComponent,
        EventsListComponent,
        GravityListComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        NodeInfoComponent,
        RenameTwigletModalComponent,
        SequenceListComponent,
        SimulationControlsComponent,
        SplashComponent,
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
        ViewsSaveModalComponent,
        ViewDropdownComponent,
        BreadcrumbNavigationComponent,
        TwigletGravityComponent,
    ],
    entryComponents: [
        AboutEventAndSeqModalComponent,
        AboutTwigletModalComponent,
        CreateEventModalComponent,
        CreateTwigletModalComponent,
        EditGravityPointModalComponent,
        EditLinkModalComponent,
        EditNodeModalComponent,
        EditSequenceModalComponent,
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
        SequenceListComponent,
        SimulationControlsComponent,
        TwigletDropdownComponent,
        TwigletEventsComponent,
        TwigletFiltersComponent,
        TwigletGraphComponent,
        TwigletModeLeftBarComponent,
        TwigletModelViewComponent,
        TwigletNodeListComponent,
        ViewsSaveModalComponent,
    ],
    imports: [
        BoundSensorModule,
        CommonModule,
        NgbModule.forRoot(),
        router,
        SharedModule,
        ToastModule.forRoot(),
        DismissibleHelpModule,
    ],
})
export class TwigletsModule { }
