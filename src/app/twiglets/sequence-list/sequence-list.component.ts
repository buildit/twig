
import {first} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { ToastrService } from 'ngx-toastr';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteSequenceConfirmationComponent } from './../../shared/delete-confirmation/delete-sequence-confirmation.component';
import { EditSequenceModalComponent } from './../edit-sequence-modal/edit-sequence-modal.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import SEQUENCE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/sequence';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

// No closing by escape or clicking outside the modal.
const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
}
@Component({
  selector: 'app-sequence-list',
  styleUrls: ['./sequence-list.component.scss'],
  templateUrl: './sequence-list.component.html',
})
export class SequenceListComponent {
  @Input() eventsList;
  @Input() sequences;
  @Input() userState: Map<string, any>;
  @Input() sequenceId: string;
  SEQUENCE = SEQUENCE_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, public modalService: NgbModal) {
  }

  toggleSequence(seq) {
    if (this.sequenceId === seq.get(this.SEQUENCE.ID)) {
      this.stateService.twiglet.eventsService.deselectSequence();
    } else {
      this.stateService.twiglet.eventsService.loadSequence(seq.get(this.SEQUENCE.ID)).subscribe(() => undefined);
    }
  }

  newSequence() {
    this.stateService.twiglet.eventsService.deselectSequence();
    const modelRef = this.modalService.open(EditSequenceModalComponent, modalOptions);
    const component = <EditSequenceModalComponent>modelRef.componentInstance;
  }

  editSequence(seq) {
    this.stateService.twiglet.eventsService.loadSequence(seq.get(this.SEQUENCE.ID)).pipe(first()).subscribe(events => {
      this.stateService.twiglet.eventsService.createBackup();
      const modelRef = this.modalService.open(EditSequenceModalComponent, modalOptions);
      const component = <EditSequenceModalComponent>modelRef.componentInstance;
      component.id = seq.get(this.SEQUENCE.ID);
      component.formStartValues = {
        description: seq.get(this.SEQUENCE.DESCRIPTION),
        id: seq.get(this.SEQUENCE.ID),
        name: seq.get(this.SEQUENCE.NAME),
      };
      component.typeOfSave = 'updateSequence';
    })
  }

  deleteSequence(seq) {
    const modelRef = this.modalService.open(DeleteSequenceConfirmationComponent);
    const component = <DeleteSequenceConfirmationComponent>modelRef.componentInstance;
    component.sequenceId = seq.get(this.SEQUENCE.ID);
    component.resourceName = seq.get(this.SEQUENCE.NAME);
  }

  openAbout(seq) {
    const modelRef = this.modalService.open(AboutEventAndSeqModalComponent);
    const component = <AboutEventAndSeqModalComponent>modelRef.componentInstance;
    component.name = seq.get(this.SEQUENCE.NAME);
    component.description = seq.get(this.SEQUENCE.DESCRIPTION);
  }

}
