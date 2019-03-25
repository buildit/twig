import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-delete-event-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteEventConfirmationComponent implements OnInit {
  @ViewChild('autofocus') private elementRef: ElementRef;
  eventId: string;
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
   * @memberOf DeleteEventConfirmationComponent
   */
  deleteConfirmed() {
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.eventsService.deleteEvent(this.eventId).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
      this.toastr.success(`${this.resourceName} deleted`, null);
    }, handleError.bind(this));
  }
}
