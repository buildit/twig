import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ping',
  styleUrls: ['./ping.component.scss'],
  templateUrl: './ping.component.html',
})
export class PingComponent implements OnInit {
  userState;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  setup(userState) {
    this.userState = userState;
  }

}
