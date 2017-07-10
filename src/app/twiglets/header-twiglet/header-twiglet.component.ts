import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  selector: 'app-header-twiglet',
  styleUrls: ['./header-twiglet.component.scss'],
  templateUrl: './header-twiglet.component.html',
})
export class HeaderTwigletComponent {
  @Input() dirtyTwiglet;
  @Input() dirtyTwigletModel;
  @Input() twiglet;
  @Input() twiglets;
  @Input() models;
  @Input() userState;
  @Input() twigletChangelog;
  @Input() twigletModel;

  constructor(private stateService: StateService, public modalService: NgbModal) {}

  setRenderEveryTick($event) {
    this.stateService.userState.setRenderOnEveryTick($event.target.checked);
  }

  setRunSimulation($event) {
    this.stateService.userState.setRunSimulation($event.target.checked);
  }

  startEditing() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setFormValid(true);
    this.stateService.userState.setEditing(true);
  }

  createNewTwiglet() {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    const component = <CreateTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletAndModelLists(this.twiglets, this.models);
  }

  saveTwiglet() {
    const modalRef = this.modalService.open(CommitModalComponent);
    const commitModal = modalRef.componentInstance as CommitModalComponent;
    commitModal.observable.first().subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.saveChanges(formResult.commit).subscribe(response => {
        if (!formResult.continueEdit) {
          this.stateService.userState.setEditing(false);
        } else {
          this.stateService.twiglet.createBackup();
        }
        this.stateService.userState.stopSpinner();
        commitModal.closeModal();
      }, this.handleError(commitModal));
    });
  }

  saveTwigletModel() {
    const modalRef = this.modalService.open(CommitModalComponent);
    const commitModal = modalRef.componentInstance as CommitModalComponent;
    commitModal.setCommitMessage(`${this.twiglet.get('name')}'s model changed`);
    commitModal.observable.first().subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.modelService.saveChanges(this.twiglet.get('name'), formResult.commit).subscribe(response => {
        this.stateService.twiglet.loadTwiglet(this.twiglet.get('name')).subscribe(() => {
          if (!formResult.continueEdit) {
            this.stateService.userState.setEditing(false);
            this.stateService.userState.setTwigletModelEditing(false);
          } else {
            this.stateService.twiglet.createBackup();
          }
          this.stateService.userState.stopSpinner();
          commitModal.closeModal();
        }, this.handleError(commitModal));
      }, this.handleError(commitModal));
    });
  }

  discardChanges() {
    this.stateService.twiglet.restoreBackup();
    this.stateService.userState.setEditing(false);
  }

  toggleTwigletEditing() {
    if (!this.dirtyTwigletModel) {
      this.stateService.userState.setTwigletModelEditing(false);
    }
  }

  toggleTwigletModelEditing() {
    if (!this.dirtyTwiglet) {
      this.stateService.userState.setTwigletModelEditing(true);
    }
  }

  getTwigletTabClass() {
    let classNames = 'edit-tab ';
    if (this.dirtyTwigletModel) {
      classNames += 'disabled ';
    }
    if (!this.userState.get('editTwigletModel')) {
      classNames += 'active ';
    }
    return classNames;
  }

  getTwigletModelTabClass() {
    let classNames = 'edit-tab ';
    if (this.dirtyTwiglet) {
      classNames += 'disabled ';
    }
    if (this.userState.get('editTwigletModel')) {
      classNames += 'active ';
    }
    return classNames;
  }

  handleError(commitModal) {
    return error => {
      this.stateService.userState.stopSpinner();
      commitModal.errorMessage = 'Something went wrong saving your changes.';
      console.error(error);
    };
  }

}
