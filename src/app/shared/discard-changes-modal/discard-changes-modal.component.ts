import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface DiscardResult {
  saveChanges: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-discard-changes-modal',
  styleUrls: ['./discard-changes-modal.component.scss'],
  templateUrl: './discard-changes-modal.component.html',
})
export class DiscardChangesModalComponent {
  discardResult: ReplaySubject<DiscardResult> = new ReplaySubject();

  constructor(public activeModal: NgbActiveModal) { }

  get observable() {
    return this.discardResult.asObservable();
  }

  saveChanges(boolean) {
    this.activeModal.close('Cross click');
    this.discardResult.next({ saveChanges: boolean});
  }

}
