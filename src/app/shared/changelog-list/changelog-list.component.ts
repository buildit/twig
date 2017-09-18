import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, HostListener } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';

import { UserState } from './../../../non-angular/interfaces/userState/index';
import CHANGELOG_CONSTANTS from '../../../non-angular/services-helpers/changelog/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-list',
  styleUrls: ['./changelog-list.component.scss'],
  templateUrl: './changelog-list.component.html',
})
export class ChangelogListComponent {
  @Input() changelog: List<Map<string, any>>;
  CHANGELOG = CHANGELOG_CONSTANTS;

  constructor(public activeModal: NgbActiveModal) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
        this.activeModal.close();
    }
  }

}
