import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { handleError } from '../../../non-angular/services-helpers';
import { ModelChangelog } from './../../../non-angular/interfaces/model/index';
import { StateService } from './../../state.service';

@Component({
  selector: 'app-header-model',
  styleUrls: ['./header-model.component.scss'],
  templateUrl: './header-model.component.html',
})
export class HeaderModelComponent {
  @Input() models;
  @Input() model;
  @Input() userState;

  constructor(private stateService: StateService, public modalService: NgbModal) {
  }

  createNewModel() {
    const modelRef = this.modalService.open(CreateModelModalComponent);
    const component = <CreateModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
  }

  startEditing() {
    this.stateService.userState.setEditing(true);
  }

  discardChanges() {
    this.stateService.userState.setEditing(false);
    this.stateService.userState.setFormValid(true);
  }

  saveModel() {
    const modalRef = this.modalService.open(CommitModalComponent);
    const commitModal = modalRef.componentInstance as CommitModalComponent;
    commitModal.observable.first().subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.model.saveChanges(formResult.commit).subscribe(() => {
        if (!formResult.continueEdit) {
          this.stateService.userState.setEditing(false);
        }
        commitModal.closeModal();
        this.stateService.userState.stopSpinner();
      }, handleError.bind(this));
    });
  }

}
