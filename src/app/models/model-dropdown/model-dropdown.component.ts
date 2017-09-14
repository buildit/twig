import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CloneModelModalComponent } from './../clone-model-modal/clone-model-modal.component';
import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { DeleteModelConfirmationComponent } from './../../shared/delete-confirmation/delete-model-confirmation.component';
import { RenameModelModalComponent } from './../rename-model-modal/rename-model-modal.component';
import { StateService } from '../../state.service';
import { UserState } from './../../../non-angular/interfaces';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-dropdown',
  styleUrls: ['./model-dropdown.component.scss'],
  templateUrl: './model-dropdown.component.html',
})
export class ModelDropdownComponent {
  @Input() models;
  @Input() model;
  @Input() userState;
  MODEL = MODEL_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public modalService: NgbModal, private router: Router) {}

  loadModel(name) {
    this.stateService.twiglet.clearCurrentTwiglet();
    this.router.navigate(['/model', name]);
  }

  renameModel(modelName) {
    const modelRef = this.modalService.open(RenameModelModalComponent);
    const component = <RenameModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
    component.modelName = modelName;
  }

  cloneModel(name: string) {
    const modelRef = this.modalService.open(CloneModelModalComponent);
    const component = <CloneModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
    component.model = this.model;
    component.modelName = name;
  }

  deleteModel(name: string) {
    const modelRef = this.modalService.open(DeleteModelConfirmationComponent);
    const component = <DeleteModelConfirmationComponent>modelRef.componentInstance;
    component.model = this.model;
    component.resourceName = name;
  }

}
