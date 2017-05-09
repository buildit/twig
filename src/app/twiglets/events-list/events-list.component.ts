import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
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
  @Input() userState;
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
    if (this.userState.get('currentEvent') !== id) {
      this.stateService.twiglet.showEvent(id);
    } else {
      this.stateService.twiglet.showEvent(null);
    }
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

  @HostListener('window:keydown', ['$event'])
  keyboardDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      this.stateService.twiglet.nextEvent();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      this.stateService.twiglet.previousEvent();
    }
  }

  openAbout(event) {
    const modelRef = this.modalService.open(AboutEventAndSeqModalComponent);
    const component = <AboutEventAndSeqModalComponent>modelRef.componentInstance;
    component.name = event.get('name');
    component.description = event.get('description');
  }

}
