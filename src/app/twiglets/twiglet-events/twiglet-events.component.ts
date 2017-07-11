import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EditEventsAndSeqModalComponent } from './../edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-events',
  styleUrls: ['./twiglet-events.component.scss'],
  templateUrl: './twiglet-events.component.html',
})
export class TwigletEventsComponent implements OnInit {
  @Input() sequences;
  @Input() userState;
  @Input() eventsList;

  constructor(public modalService: NgbModal, private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  createEvent() {
    const modelRef = this.modalService.open(EditEventsAndSeqModalComponent);
    const component = <EditEventsAndSeqModalComponent>modelRef.componentInstance;
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
