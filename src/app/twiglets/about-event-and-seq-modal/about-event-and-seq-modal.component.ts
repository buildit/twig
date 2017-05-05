import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about-event-and-seq-modal',
  styleUrls: ['./about-event-and-seq-modal.component.scss'],
  templateUrl: './about-event-and-seq-modal.component.html',
})
export class AboutEventAndSeqModalComponent implements OnInit {
  name: string;
  description: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
