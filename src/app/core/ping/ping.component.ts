import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PingService } from './ping.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ping',
  styleUrls: ['./ping.component.scss'],
  templateUrl: './ping.component.html',
})
export class PingComponent implements OnInit {
  pingSubscription;

  constructor(private pingService: PingService, public activeModal: NgbActiveModal) {
    this.pingSubscription = this.pingService.getPing().subscribe(response => {
      console.log(response);
    });
  }

  ngOnInit() {
  }

}
