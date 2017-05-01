import { StateService } from './../../state.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events-list',
  styleUrls: ['./events-list.component.scss'],
  templateUrl: './events-list.component.html',
})
export class EventsListComponent implements OnInit {
  @Input() eventsList;

  constructor(private stateService: StateService) {
  }

  ngOnInit() {
  }

  updateEventSequence(index, $event) {
    this.stateService.twiglet.eventService.updateEventSequence(index, $event.target.checked);
  }

  preview(id) {
    this.stateService.twiglet.showEvent(id);
  }

}
