import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from './../state.service';
import { handleError } from '../../non-angular/services-helpers';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-header-model',
  styleUrls: ['./header-model.component.scss'],
  templateUrl: './header-model.component.html',
})
export class HeaderModelComponent implements OnInit {
  private userState: Map<string, any>;

  constructor(private stateService: StateService, private toastr: ToastsManager) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
 }

  ngOnInit() {
  }

  saveModel() {
    this.stateService.model.saveChanges().subscribe(result => {
      this.toastr.success('Model saved successfully');
    }, handleError.bind(this));
  }

  discardChanges() {
    this.stateService.userState.setFormValid(true);
    this.stateService.model.restoreBackup();
  }

}
