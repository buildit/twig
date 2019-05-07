import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-delete-sequence-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteSequenceConfirmationComponent implements OnInit {
  @ViewChild('autofocus') private elementRef: ElementRef;
  sequenceId: string;
  resourceName: string;
  inputName: string;

  constructor(public stateService: StateService, public modalService: NgbModal, public toastr: ToastrService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.focus();
  }

  /**
   * Runs when the user presses Delete
   *
   *
   * @memberOf DeleteSequenceConfirmationComponent
   */
  deleteConfirmed() {
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.eventsService.deleteSequence(this.sequenceId).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshSequences();
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success(`${this.resourceName} deleted`, null);
    }, handleError.bind(this));
  }
}
