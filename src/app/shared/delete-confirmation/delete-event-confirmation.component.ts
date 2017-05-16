import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-delete-event-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteEventConfirmationComponent {
  eventId: string;
  resourceName: string;
  inputName: string;

  constructor(public stateService: StateService, public modalService: NgbModal, public toastr: ToastsManager,
    public activeModal: NgbActiveModal) {
  }

  /**
   * Runs when the user presses Delete
   *
   *
   * @memberOf DeleteEventConfirmationComponent
   */
  deleteConfirmed() {
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.eventsService.deleteEvent(this.eventId).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success(`${this.resourceName} deleted`);
    }, handleError.bind(this));
  }
}
