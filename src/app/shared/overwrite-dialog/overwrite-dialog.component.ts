import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-overwrite-dialog',
  styleUrls: ['./overwrite-dialog.component.scss'],
  templateUrl: './overwrite-dialog.component.html',
})
export class OverwriteDialogComponent {
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

}
