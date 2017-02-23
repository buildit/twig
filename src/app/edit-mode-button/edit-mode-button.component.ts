import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() userState;
  @Input() twigletModel;
  @Input() twigletName;
  twigletUrl: string;
  errorMessage: string;

  constructor(
    private stateService: StateService,
    public modalService: NgbModal,
    private cd: ChangeDetectorRef,
    public router: Router) {
  }

  startEditing() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
    this.twigletUrl = this.router.url;
  }

  editTwigletModel() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
    this.stateService.userState.setTwigletModelEditing(true);
    this.twigletUrl = this.router.url;
    this.router.navigate([this.twigletUrl, 'model']);
  }

  discardChanges() {
    this.stateService.userState.setEditing(false);
    this.stateService.userState.setTwigletModelEditing(false);
    this.router.navigate([this.twigletUrl]);
    this.stateService.twiglet.restoreBackup();
  }

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

  saveTwigletModel() {
    this.stateService.twiglet.modelService.saveChanges(this.twigletName).subscribe(response => {
      this.stateService.userState.setEditing(false);
    }, err => {
      this.errorMessage = 'Something went wrong saving your changes.';
      console.error(err);
    });
    this.stateService.twiglet.saveChanges(`${this.twigletName}'s model changed`).subscribe(response => {
      this.stateService.twiglet.updateListOfTwiglets();
    }, err => {
      this.errorMessage = 'Something went wrong saving your changes.';
      console.error(err);
    });
  }
}
