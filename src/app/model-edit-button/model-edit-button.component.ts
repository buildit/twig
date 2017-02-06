import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from './../state.service';
import { handleError } from '../../non-angular/services-helpers';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-model-edit-button',
  styleUrls: ['./model-edit-button.component.scss'],
  templateUrl: './model-edit-button.component.html',
})
export class ModelEditButtonComponent implements OnInit {
  private userState: Map<string, any>;

  constructor(private stateService: StateService, private toastr: ToastsManager) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }

  ngOnInit() {
  }

  startEditing() {
    this.stateService.userState.setEditing(true);
  }

  saveModel() {
    this.stateService.model.saveChanges().subscribe(result => {
      this.toastr.success('Model saved successfully');
      this.stateService.userState.setEditing(false);
    }, handleError.bind(this));
  }

  discardChanges() {
    this.stateService.userState.setFormValid(true);
    this.stateService.model.restoreBackup();
    this.stateService.userState.setEditing(false);
  }

}
