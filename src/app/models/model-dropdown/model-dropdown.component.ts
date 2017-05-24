import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CloneModelModalComponent } from './../clone-model-modal/clone-model-modal.component';
import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { DeleteModelConfirmationComponent } from './../../shared/delete-confirmation/delete-model-confirmation.component';
import { EditModelDetailsComponent } from './../edit-model-details/edit-model-details.component';
import { StateService } from '../../state.service';
import { UserState } from './../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-dropdown',
  styleUrls: ['./model-dropdown.component.scss'],
  templateUrl: './model-dropdown.component.html',
})
export class ModelDropdownComponent implements OnInit {
  @Input() models;
  @Input() model;
  @Input() userState;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
  }

  loadModel(name) {
    this.stateService.twiglet.clearCurrentTwiglet();
    this.router.navigate(['/model', name]);
  }

  openNewModelModal() {
    const modelRef = this.modalService.open(CreateModelModalComponent);
    const component = <CreateModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
  }

  renameModel(modelName) {
    const modelRef = this.modalService.open(EditModelDetailsComponent);
    const component = <EditModelDetailsComponent>modelRef.componentInstance;
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
