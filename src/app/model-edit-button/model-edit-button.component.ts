import { Component, OnInit, Input } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from './../state.service';
import { handleError } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-model-edit-button',
  styleUrls: ['./model-edit-button.component.scss'],
  templateUrl: './model-edit-button.component.html',
})
export class ModelEditButtonComponent implements OnInit {
  @Input() userState;

  constructor(private stateService: StateService, private toastr: ToastsManager) {
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
