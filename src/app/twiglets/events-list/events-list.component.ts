import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, OnChanges,
    AfterViewChecked, SimpleChanges, ElementRef, Inject, ViewChild } from '@angular/core';
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
export class EventsListComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() userState;
  @Input() eventsList;
  @Input() sequences;
  currentEvent;
  needToScroll = false;
  userClick = false;

  constructor(public stateService: StateService, public modalService: NgbModal, private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState
          && changes.userState.currentValue.get('currentEvent')
          && this.currentEvent !== changes.userState.currentValue.get('currentEvent')) {
      this.currentEvent = changes.userState.currentValue.get('currentEvent');
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
    if (this.userState.get('currentEvent') !== id) {
      this.userClick = true;
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
    component.name = event.get('name');
    component.description = event.get('description');
  }

}
