import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces';
import { NewModelModalComponent } from './../new-model-modal/new-model-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-dropdown',
  styleUrls: ['./model-dropdown.component.scss'],
  templateUrl: './model-dropdown.component.html',
})
export class ModelDropdownComponent implements OnInit {
  @Input() models;
  userState: UserState;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
  }

  loadModel(id) {
    this.router.navigate(['/model', id]);
    this.stateService.userState.setNewModel(false);
  }

  openNewModelForm() {
    this.router.navigate(['/model', '_new']);
    this.stateService.userState.setNewModel(true);
    this.stateService.model.clearModel();
  }

  openNewModelModal() {
    const modelRef = this.modalService.open(NewModelModalComponent, { size: 'lg' });
    const component = <NewModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
  }

  cloneModel(model) {

  }

  deleteModel(id) {

  }

}
