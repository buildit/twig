import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteSequenceConfirmationComponent } from './../../shared/delete-confirmation/delete-sequence-confirmation.component';
import { EditEventsAndSeqModalComponent } from './../edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import SEQUENCE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/sequence';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-sequence-list',
  styleUrls: ['./sequence-list.component.scss'],
  templateUrl: './sequence-list.component.html',
})
export class SequenceListComponent implements OnDestroy {
  @Input() sequences;
  @Input() userState: Map<string, any>;
  currentSequence: string;
  SEQUENCE = SEQUENCE_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, public modalService: NgbModal) { }

  ngOnDestroy() {
    this.currentSequence = '';
  }

  loadSequence(id) {
    if (this.currentSequence === id) {
      this.currentSequence = '';
      this.stateService.twiglet.eventsService.setAllCheckedTo(false);
    } else {
      this.stateService.twiglet.eventsService.loadSequence(id);
      this.currentSequence = id;
    }
  }

  newSequence() {
    const modelRef = this.modalService.open(EditEventsAndSeqModalComponent);
    const component = <EditEventsAndSeqModalComponent>modelRef.componentInstance;
    component.typeOfSave = 'createSequence';
    component.successMessage = 'Sequence Saved';
    component.title = 'Create New Sequence';
  }

  editSequence(seq) {
    const modelRef = this.modalService.open(EditEventsAndSeqModalComponent);
    const component = <EditEventsAndSeqModalComponent>modelRef.componentInstance;
    component.formStartValues = {
      description: seq.get(this.SEQUENCE.DESCRIPTION),
      id: seq.get(this.SEQUENCE.ID),
      name: seq.get(this.SEQUENCE.NAME),
    };
    component.typeOfSave = 'updateSequence';
    component.successMessage = 'Sequence Updated';
    component.title = `Update ${seq.get(this.SEQUENCE.NAME)}`;
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
