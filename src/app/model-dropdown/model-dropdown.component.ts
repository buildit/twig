import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces';
import { NewModelModalComponent } from './../new-model-modal/new-model-modal.component';
import { DeleteModelConfirmationComponent } from './../delete-model-confirmation/delete-model-confirmation.component';
import { CloneModelModalComponent } from './../clone-model-modal/clone-model-modal.component';
import { EditModelDetailsComponent } from './../edit-model-details/edit-model-details.component';

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

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
  }

  loadModel(name) {
    this.stateService.userState.setActiveModel(true);
    this.stateService.userState.setActiveTwiglet(false);
    this.router.navigate(['/model', name]);
  }

  openNewModelModal() {
    const modelRef = this.modalService.open(NewModelModalComponent, { size: 'lg' });
    const component = <NewModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
  }

  renameModel(modelName) {
    const modelRef = this.modalService.open(EditModelDetailsComponent);
    const component = <EditModelDetailsComponent>modelRef.componentInstance;
    component.currentModelOpenedName = this.model.get('name');
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
    component.modelName = name;
  }

}
