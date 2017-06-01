import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteSequenceConfirmationComponent } from './../../shared/delete-confirmation/delete-sequence-confirmation.component';
import { EditEventsAndSeqModalComponent } from './../edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  selector: 'app-sequence-dropdown',
  styleUrls: ['./sequence-dropdown.component.scss'],
  templateUrl: './sequence-dropdown.component.html',
})
export class SequenceDropdownComponent implements OnInit {
  @Input() sequences;
  @Input() userState;

  constructor(private stateService: StateService, public modalService: NgbModal) { }

  ngOnInit() {  }

  loadSequence(id) {
    this.stateService.twiglet.eventsService.loadSequence(id);
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
      description: seq.get('description'),
      id: seq.get('id'),
      name: seq.get('name'),
    };
    component.typeOfSave = 'updateSequence';
    component.successMessage = 'Sequence Updated';
    component.title = `Update ${seq.get('name')}`;
  }

  deleteSequence(seq) {
    const modelRef = this.modalService.open(DeleteSequenceConfirmationComponent);
    const component = <DeleteSequenceConfirmationComponent>modelRef.componentInstance;
    component.sequenceId = seq.get('id');
    component.resourceName = seq.get('name');
  }

  openAbout(seq) {
    const modelRef = this.modalService.open(AboutEventAndSeqModalComponent);
    const component = <AboutEventAndSeqModalComponent>modelRef.componentInstance;
    component.name = seq.get('name');
    component.description = seq.get('description');
  }

}
