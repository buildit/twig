import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-overwrite-dialog',
  styleUrls: ['./overwrite-dialog.component.scss'],
  templateUrl: './overwrite-dialog.component.html',
})
export class OverwriteDialogComponent implements OnInit {
  commit;
  userResponse = new ReplaySubject;
  datePipe = new DatePipe('en-US');

  constructor(public activeModal: NgbActiveModal) { }

  yes () {
    this.userResponse.next(true);
    this.activeModal.close();
  }

  no() {
    this.userResponse.next(false);
    this.activeModal.close();
  }

  ngOnInit() {
  }

}
