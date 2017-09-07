import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about-event-and-seq-modal',
  styleUrls: ['./about-event-and-seq-modal.component.scss'],
  templateUrl: './about-event-and-seq-modal.component.html',
})
export class AboutEventAndSeqModalComponent {
  name: string;
  description: string;

  constructor(private cd: ChangeDetectorRef, public activeModal: NgbActiveModal) { }

}
