import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CreateEventModalComponent } from './../create-event-modal/create-event-modal.component';
import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-events',
  styleUrls: ['./twiglet-events.component.scss'],
  templateUrl: './twiglet-events.component.html',
})
export class TwigletEventsComponent {
  @Input() sequences;
  @Input() userState: Map<string, any>;
  @Input() eventsList;
  @Input() sequenceId;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public modalService: NgbModal, private stateService: StateService, private cd: ChangeDetectorRef) { }

  createEvent() {
    const modelRef = this.modalService.open(CreateEventModalComponent);
    const component = <CreateEventModalComponent>modelRef.componentInstance;
  }

  play() {
    this.stateService.twiglet.playSequence();
  }

  stepBack() {
    this.stateService.twiglet.previousEvent();
  }

  stepForward() {
    this.stateService.twiglet.nextEvent();
  }

  stop() {
    this.stateService.twiglet.stopPlayback();
  }

  setPlaybackInterval($event: number) {
    this.stateService.userState.setPlaybackInterval($event * 1000);
  }

}
