import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { CommitModalComponent } from '../commit-modal/commit-modal.component';
import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-mode-button',
  styleUrls: ['./edit-mode-button.component.scss'],
  templateUrl: './edit-mode-button.component.html',
})
export class EditModeButtonComponent {
  @Input() userState;
  @Input() twigletModel;
  @Input() twiglet;
  errorMessage: string;

  constructor(private stateService: StateService, public modalService: NgbModal, public router: Router) {
  }

  startEditing() {
    if (this.twiglet) {
      if (this.userState.get('currentEvent')) {
        this.stateService.twiglet.showEvent(null);
        this.stateService.twiglet.createBackup();
        // if there is an event currently loaded, need to give twiglet time to reset itself properly or nodes and links will
        // be out of place when edit mode turns on
        setTimeout(() => { this.stateService.userState.setEditing(true); }, 500);
      }
      if (!this.userState.get('currentEvent')) {
        this.stateService.twiglet.createBackup();
        this.stateService.userState.setEditing(true);
      }
    }
    if (!this.twiglet) {
      this.stateService.userState.setEditing(true);
    }
  }

  editTwigletModel() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
    this.stateService.userState.setTwigletModelEditing(true);
    this.router.navigate(['/twiglet', this.twiglet.get('name'), 'model']);
  }

  discardChanges() {
    this.stateService.userState.setEditing(false);
    this.stateService.userState.setTwigletModelEditing(false);
    if (this.twiglet) {
      this.stateService.twiglet.restoreBackup();
      this.router.navigate(['twiglet', this.twiglet.get('name')]);
    }
  }

  saveChanges() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

  saveTwigletModel() {
    
  }
}
