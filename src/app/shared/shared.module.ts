import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';

import 'hammerjs';

import { ChangelogListComponent } from './changelog-list/changelog-list.component';
import { CommitModalComponent } from './commit-modal/commit-modal.component';
import { DeleteModelConfirmationComponent } from './delete-confirmation/delete-model-confirmation.component';
import { DeleteTwigletConfirmationComponent } from './delete-confirmation/delete-twiglet-confirmation.component';
import { DeleteViewConfirmationComponent } from './delete-confirmation/delete-view-confirmation.component';
import { EditModeButtonComponent } from './edit-mode-button/edit-mode-button.component';
import { FilterNodesPipe } from './filter-nodes.pipe';
import { FontAwesomeIconPickerComponent } from './font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { FormControlsSortPipe } from './form-controls-sort.pipe';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { KeyValuesPipe } from './key-values.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NodeSearchPipe } from './node-search.pipe';
import { ObjectSortPipe } from './object-sort.pipe';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { OverwriteDialogComponent } from './overwrite-dialog/overwrite-dialog.component';
import { PrimitiveArraySortPipe } from './primitive-array-sort.pipe';
import { router } from './../app.router';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './sort-immutable.pipe';
import { FilterByJsonPipe } from './filter-by-json.pipe';

@NgModule({
    declarations: [
        ChangelogListComponent,
        CommitModalComponent,
        DeleteModelConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        EditModeButtonComponent,
        FilterNodesPipe,
        FontAwesomeIconPickerComponent,
        FontAwesomeToggleButtonComponent,
        FormControlsSortPipe,
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        LoadingSpinnerComponent,
        NodeSearchPipe,
        ObjectToArrayPipe,
        ObjectSortPipe,
        OverwriteDialogComponent,
        PrimitiveArraySortPipe,
        SliderWithLabelComponent,
        SortImmutablePipe,
        FilterByJsonPipe,
    ],
    entryComponents: [
        CommitModalComponent,
        DeleteModelConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        LoadingSpinnerComponent,
        OverwriteDialogComponent,
    ],
    exports: [
        ChangelogListComponent,
        CommitModalComponent,
        DatePipe,
        DeleteModelConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        DragulaModule,
        EditModeButtonComponent,
        FilterNodesPipe,
        FontAwesomeIconPickerComponent,
        FontAwesomeToggleButtonComponent,
        FormControlsSortPipe,
        FormsModule,
        HttpModule,
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        LoadingSpinnerComponent,
        NodeSearchPipe,
        ObjectToArrayPipe,
        ObjectSortPipe,
        OverwriteDialogComponent,
        PrimitiveArraySortPipe,
        ReactiveFormsModule,
        SliderWithLabelComponent,
        SortImmutablePipe,
        TrimValueAccessorModule,
    ],
    imports: [
        CommonModule,
        DragulaModule,
        FormsModule,
        HttpModule,
        Ng2PageScrollModule.forRoot(),
        NgbModule.forRoot(),
        ReactiveFormsModule,
        router,
        ToastModule.forRoot(),
        TrimValueAccessorModule,
    ],
    providers: [DatePipe]
})
export class SharedModule { }
