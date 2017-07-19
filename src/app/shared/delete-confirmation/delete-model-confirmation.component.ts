import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { Model } from './../../../non-angular/interfaces/model';
import { StateService } from '../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  selector: 'app-delete-model-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteModelConfirmationComponent {
  model: Map<string, any> = Map({});
  userState: UserState;
  resourceName: string;
  inputName: string;

  constructor(public stateService: StateService,
    public modalService: NgbModal,
    public router: Router,
    public toastr: ToastsManager,
    public activeModal: NgbActiveModal) { }

  /**
   * Runs when the user presses Delete
   *
   *
   * @memberOf DeleteModelConfirmationComponent
   */
  deleteConfirmed() {
    const self = this;
    this.stateService.userState.startSpinner();
    this.stateService.model.removeModel(this.resourceName).subscribe(response => {
      this.stateService.model.updateListOfModels();
      this.toastr.success('Model deleted successfully', null, { dismiss: 'click' });
      if (self.model.get('name') === self.resourceName) {
        this.router.navigate(['/model']);
      }
      this.stateService.userState.stopSpinner();
      this.activeModal.close();
    }, handleError.bind(self));
  }

}
