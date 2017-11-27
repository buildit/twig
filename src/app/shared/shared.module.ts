import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { DragulaModule } from 'ng2-dragula';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';

import 'hammerjs';

import { ChangelogListComponent } from './changelog-list/changelog-list.component';
import { CommitModalComponent } from './commit-modal/commit-modal.component';
import { DeleteEventConfirmationComponent } from './delete-confirmation/delete-event-confirmation.component';
import { DeleteModelConfirmationComponent } from './delete-confirmation/delete-model-confirmation.component';
import { DeleteSequenceConfirmationComponent } from './delete-confirmation/delete-sequence-confirmation.component';
import { DeleteTwigletConfirmationComponent } from './delete-confirmation/delete-twiglet-confirmation.component';
import { DeleteViewConfirmationComponent } from './delete-confirmation/delete-view-confirmation.component';
import { DiscardChangesModalComponent } from './discard-changes-modal/discard-changes-modal.component';
import { FilterByObjectPipe } from './pipes/filter-by-object.pipe';
import { FilterImmutablePipe } from './pipes/filter-immutable.pipe';
import { FilterImmutableByBoolPipe } from './pipes/filter-immutable-by-bool.pipe';
import { FontAwesomeIconPickerComponent } from './font-awesome-icon-picker/font-awesome-icon-picker.component';
import { FormControlsSortPipe } from './pipes/form-controls-sort.pipe';
import { ImmutableMapOfMapsPipe } from './pipes/immutable-map-of-maps.pipe';
import { KeyValuesPipe } from './pipes/key-values.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NodeSearchPipe } from './pipes/node-search.pipe';
import { ObjectSortPipe } from './pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './pipes/object-to-array.pipe';
import { OverwriteDialogComponent } from './overwrite-dialog/overwrite-dialog.component';
import { PrimitiveArraySortPipe } from './pipes/primitive-array-sort.pipe';
import { router } from './../app.router';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { SortImmutablePipe } from './pipes/sort-immutable.pipe';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { DismissibleHelpDialogComponent } from './dismissible-help-dialog/dismissible-help-dialog.component';

@NgModule({
    declarations: [
        ChangelogListComponent,
        CommitModalComponent,
        DeleteEventConfirmationComponent,
        DeleteModelConfirmationComponent,
        DeleteSequenceConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        DiscardChangesModalComponent,
        DismissibleHelpDialogComponent,
        FilterByObjectPipe,
        FilterImmutablePipe,
        FilterImmutableByBoolPipe,
        FontAwesomeIconPickerComponent,
        FormControlsSortPipe,
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        LoadingSpinnerComponent,
        NodeSearchPipe,
        ObjectToArrayPipe,
        ObjectSortPipe,
        OverwriteDialogComponent,
        PrimitiveArraySortPipe,
        SanitizeHtmlPipe,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
    ],
    entryComponents: [
        ChangelogListComponent,
        CommitModalComponent,
        DeleteEventConfirmationComponent,
        DeleteModelConfirmationComponent,
        DeleteSequenceConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        DiscardChangesModalComponent,
        LoadingSpinnerComponent,
        OverwriteDialogComponent,
    ],
    exports: [
        ChangelogListComponent,
        CommitModalComponent,
        DatePipe,
        DeleteEventConfirmationComponent,
        DeleteModelConfirmationComponent,
        DeleteSequenceConfirmationComponent,
        DeleteTwigletConfirmationComponent,
        DeleteViewConfirmationComponent,
        DiscardChangesModalComponent,
        DismissibleHelpDialogComponent,
        DragulaModule,
        FilterByObjectPipe,
        FilterImmutablePipe,
        FilterImmutableByBoolPipe,
        FontAwesomeIconPickerComponent,
        FormControlsSortPipe,
        FormsModule,
        HttpModule,
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        LoadingSpinnerComponent,
        MarkdownToHtmlModule,
        NodeSearchPipe,
        ObjectToArrayPipe,
        ObjectSortPipe,
        OverwriteDialogComponent,
        PrimitiveArraySortPipe,
        ReactiveFormsModule,
        SanitizeHtmlPipe,
        SliderWithLabelComponent,
        SortImmutablePipe,
        ToggleButtonComponent,
        TrimValueAccessorModule,
    ],
    imports: [
        CommonModule,
        DragulaModule,
        FormsModule,
        HttpModule,
        MarkdownToHtmlModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        router,
        ToastModule.forRoot(),
        TrimValueAccessorModule,
    ],
    providers: [DatePipe]
})
export class SharedModule { }
