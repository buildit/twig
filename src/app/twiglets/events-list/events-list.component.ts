import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { List } from 'immutable';
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

  deleteEvent(id) {
    this.stateService.twiglet.eventsService.deleteEvent(id).subscribe(response => {
      this.stateService.twiglet.eventsService.refreshEvents();
    }, handleError.bind(this));
  }

  original() {
    this.stateService.twiglet.showOriginal();
  }

}
