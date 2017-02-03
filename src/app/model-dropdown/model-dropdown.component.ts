import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces';

@Component({
  selector: 'app-model-dropdown',
  styleUrls: ['./model-dropdown.component.scss'],
  templateUrl: './model-dropdown.component.html',
})
export class ModelDropdownComponent implements OnInit {
  models: string[];
  userState: UserState;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router) {
    this.stateService.model.models.subscribe(response => {
      this.models = response.toJS();
    });
  }

  ngOnInit() {
  }

  loadModel(id) {
    this.router.navigate(['/model', id]);
  }

  openNewModal() {

  }

  cloneModel(model) {

  }

  deleteModel(id) {

  }

}
