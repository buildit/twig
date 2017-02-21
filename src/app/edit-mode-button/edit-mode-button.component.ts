import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { Subscription } from 'rxjs';

import { UserState } from './../../non-angular/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, Input } from '@angular/core';
import { StateService } from './../state.service';
import { CommitModalComponent } from '../commit-modal/commit-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-mode-button',
  styleUrls: ['./edit-mode-button.component.scss'],
  templateUrl: './edit-mode-button.component.html',
})
export class EditModeButtonComponent {
  @Input() userState: Map<string, any>;
  @Input() twigletModel;

  constructor(
    private stateService: StateService,
    public modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router) {
  }

  startEditing() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
  }

  editTwigletModel() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
    this.router.navigate([this.router.url, 'model']);
  }

  discardChanges() {
    this.stateService.userState.setEditing(false);
    this.stateService.twiglet.restoreBackup();
  }

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }
}
