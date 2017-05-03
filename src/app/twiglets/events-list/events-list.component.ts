import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeleteEventConfirmationComponent } from './../../shared/delete-confirmation/delete-event-confirmation.component';
import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events-list',
  styleUrls: ['./events-list.component.scss'],
  templateUrl: './events-list.component.html',
})
export class EventsListComponent implements OnInit {
  @Input() eventsList;
  @Input() sequences;

  constructor(private stateService: StateService, public modalService: NgbModal) {
  }

  ngOnInit() {
  }

  updateEventSequence(index, $event) {
    this.stateService.twiglet.eventsService.updateEventSequence(index, $event.target.checked);
  }

  preview(id) {
    this.stateService.twiglet.showEvent(id);
  }

  inEventSequence(id) {
    let inSequence = false;
    this.sequences.map(sequence => {
      if (sequence.get('events').includes(id)) {
        inSequence = true;
      }
    });
    return inSequence;
  }

  deleteEvent(event) {
    const modelRef = this.modalService.open(DeleteEventConfirmationComponent);
    const component = <DeleteEventConfirmationComponent>modelRef.componentInstance;
    component.eventId = event.get('id');
    component.resourceName = event.get('name');
  }

  original() {
    this.stateService.twiglet.showOriginal();
  }

}
