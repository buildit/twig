import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';

@Component({
  selector: 'app-model-dropdown',
  styleUrls: ['./model-dropdown.component.scss'],
  templateUrl: './model-dropdown.component.html',
})
export class ModelDropdownComponent implements OnInit {
  models: string[];

  constructor(private stateService: StateService, private modalService: NgbModal) {
    this.stateService.model.models.subscribe(response => {
      this.models = response.toJS().sort((a, b) => {
        const nameA = a._id.toUpperCase();
        const nameB = b._id.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    });
  }

  ngOnInit() {
  }

  openNewModal() {

  }

  cloneModel(model) {

  }

  deleteModel(id) {

  }

}
