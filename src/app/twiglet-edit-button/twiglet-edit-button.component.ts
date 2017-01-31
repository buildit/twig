import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserState } from './../../non-angular/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { StateService } from './../state.service';
import { CommitModalComponent } from '../commit-modal/commit-modal.component';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-edit-button',
  styleUrls: ['./twiglet-edit-button.component.scss'],
  templateUrl: './twiglet-edit-button.component.html',
})
export class TwigletEditButtonComponent {
  private userState: Map<string, any>;

  constructor(
    private stateService: StateService,
    public modalService: NgbModal,
    private cd: ChangeDetectorRef) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }

  startEditing() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setEditing(true);
  }

  discardChanges() {
    this.cd.markForCheck();
    this.stateService.userState.setEditing(false);
    this.stateService.twiglet.restoreBackup();
  }

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }
}
