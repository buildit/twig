import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject,
  Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteEventConfirmationComponent } from './../../shared/delete-confirmation/delete-event-confirmation.component';
import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';
import EVENT_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/event';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events-list',
  styleUrls: ['./events-list.component.scss'],
  templateUrl: './events-list.component.html'
})
export class EventsListComponent implements OnChanges, AfterViewChecked {
  @Input() userState;
  @Input() eventsList;
  @Input() sequences;
  currentEvent;
  needToScroll = false;
  userClick = false;
  EVENT = EVENT_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, public modalService: NgbModal, private elementRef: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState
      && changes.userState.currentValue.get(this.USERSTATE.CURRENT_EVENT)
      && this.currentEvent !== changes.userState.currentValue.get(this.USERSTATE.CURRENT_EVENT)) {
      this.currentEvent = changes.userState.currentValue.get(this.USERSTATE.CURRENT_EVENT);
      if (!this.userClick) {
        this.needToScroll = true;
      } else {
        this.userClick = false;
      }
    }
  }

  ngAfterViewChecked() {
    if (this.needToScroll) {
      this.needToScroll = false;
      const active = this.elementRef.nativeElement.querySelector(`.card.event-item.active`);
      if (active) {
        active.scrollIntoView({
          behavior: 'smooth',
        });
      }
    };
  }

  updateEventSequence(index, $event) {
    this.stateService.twiglet.eventsService.updateEventSequence(index, $event.target.checked);
  }

  preview(id) {
    if (this.userState.get(this.USERSTATE.CURRENT_EVENT) !== id) {
      this.userClick = true;
      this.stateService.twiglet.showEvent(id);
    } else {
      this.stateService.twiglet.showEvent(null);
    }
  }

  deleteEvent(event) {
    const modelRef = this.modalService.open(DeleteEventConfirmationComponent);
    const component = <DeleteEventConfirmationComponent>modelRef.componentInstance;
    component.eventId = event.get(this.EVENT.ID);
    component.resourceName = event.get(this.EVENT.NAME);
  }

  original() {
    this.stateService.twiglet.showOriginal();
  }

  checkAll($event) {
    this.stateService.twiglet.eventsService.setAllCheckedTo($event.target.checked);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardDown(event: KeyboardEvent) {
    if (event.srcElement.tagName === 'BODY') {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        this.stateService.twiglet.nextEvent();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        this.stateService.twiglet.previousEvent();
      }
    }
  }

  openAbout(event) {
    const modelRef = this.modalService.open(AboutEventAndSeqModalComponent);
    const component = <AboutEventAndSeqModalComponent>modelRef.componentInstance;
    component.name = event.get(this.EVENT.NAME);
    component.description = event.get(this.EVENT.DESCRIPTION);
  }

}
