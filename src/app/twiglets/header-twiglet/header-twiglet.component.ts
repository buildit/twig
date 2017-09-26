import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';

@Component({
  selector: 'app-header-twiglet',
  styleUrls: ['./header-twiglet.component.scss'],
  templateUrl: './header-twiglet.component.html',
})
export class HeaderTwigletComponent {
  @Input() dirtyTwiglet;
  @Input() dirtyTwigletModel;
  @Input() dirtyView;
  @Input() twiglet;
  @Input() twiglets;
  @Input() models;
  @Input() userState: Map<string, any>;
  @Input() view: Map<string, any>;
  @Input() viewData: Map<string, any>;
  @Input() views;
  @Input() eventsList;
  @Input() twigletChangelog;
  @Input() twigletModel;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  EDIT_BUTTON = Object.freeze({
    DISABLED: 'disabled',
    TWIGLET: 'twiglet',
    VIEW: 'view'
  })

  constructor(private stateService: StateService, public modalService: NgbModal) {}

  correctEditButton() {
    if (!this.userState.get(this.USERSTATE.CURRENT_EVENT) && !this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      return this.EDIT_BUTTON.TWIGLET;
    }

    if (!this.userState.get(this.USERSTATE.CURRENT_EVENT) && this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      return this.EDIT_BUTTON.VIEW;
    }

    return this.EDIT_BUTTON.DISABLED;
  }

  setRenderEveryTick($event) {
    this.stateService.twiglet.viewService.setRenderOnEveryTick($event.target.checked);
  }

  setRunSimulation($event) {
    this.stateService.twiglet.viewService.setRunSimulation($event.target.checked);
  }

  startEditingTwiglet() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setFormValid(true);
    this.stateService.userState.setEditing(true);
  }

  startEditingView() {
    this.stateService.twiglet.viewService.createBackup();
    this.stateService.userState.setViewEditing(true);
  }

  createNewTwiglet() {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    const component = <CreateTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletAndModelLists(this.twiglets, this.models);
  }

  saveTwiglet() {
    const userId = this.userState.get(this.USERSTATE.USER).user.id;
    const modalRef = this.modalService.open(CommitModalComponent);
    const commitModal = modalRef.componentInstance as CommitModalComponent;
    commitModal.displayContinueEdit = true;
    commitModal.observable.first().subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.saveChanges(formResult.commit, userId).subscribe(response => {
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
    commitModal.displayContinueEdit = true;
    commitModal.setCommitMessage(`${this.twiglet.get(this.TWIGLET.NAME)}'s model changed`);
    commitModal.observable.first().subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.twiglet.modelService.saveChanges(formResult.commit).subscribe(response => {
        this.stateService.twiglet.loadTwiglet(this.twiglet.get(this.TWIGLET.NAME)).subscribe(() => {
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

  saveView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.setup(this.view.get(this.VIEW.URL), this.view.get(this.VIEW.NAME), this.view.get(this.VIEW.DESCRIPTION));
    component.views = this.views;
    component.twigletName = this.twiglet.get(this.TWIGLET.NAME);
  }

  discardTwigletChanges() {
    this.stateService.twiglet.restoreBackup();
    this.stateService.userState.setEditing(false);
  }

  discardViewChanges() {
    this.stateService.twiglet.viewService.restoreBackup();
    this.stateService.userState.setViewEditing(false);
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
    if (!this.userState.get(this.USERSTATE.EDIT_TWIGLET_MODEL)) {
      classNames += 'active ';
    }
    return classNames;
  }

  getTwigletModelTabClass() {
    let classNames = 'edit-tab ';
    if (this.dirtyTwiglet) {
      classNames += 'disabled ';
    }
    if (this.userState.get(this.USERSTATE.EDIT_TWIGLET_MODEL)) {
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
