import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

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

  constructor(private stateService: StateService) {
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

  deleteEvent(id) {
    this.stateService.twiglet.eventsService.deleteEvent(id).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
    }, handleError.bind(this));
  }

}
