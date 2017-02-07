import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces';

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

  loadModel(name) {
    this.router.navigate(['/model', name]);
    this.stateService.userState.setNewModel(false);
  }

  openNewModelForm() {
    this.router.navigate(['/model', '_new']);
    this.stateService.userState.setNewModel(true);
    this.stateService.model.clearModel();
  }

  cloneModel(model) {

  }

  deleteModel(id) {

  }

}
