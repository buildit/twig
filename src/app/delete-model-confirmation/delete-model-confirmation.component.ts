import { Map } from 'immutable';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { Model } from './../../non-angular/interfaces/model';
import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers/userState';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';

@Component({
  selector: 'app-delete-model-confirmation',
  styleUrls: ['./delete-model-confirmation.component.scss'],
  templateUrl: './delete-model-confirmation.component.html',
})
export class DeleteModelConfirmationComponent implements OnInit {
  model: Map<string, any> = Map({});
  userState: UserState;
  modelName: string;
  inputName: string;
  modelSubscription: Subscription;

  constructor(public stateService: StateService,
    public modalService: NgbModal,
    public router: Router,
    public toastr: ToastsManager,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  /**
   * Run when the user presses Delete
   *
   *
   * @memberOf DeleteModelConfirmationComponent
   */
  deleteConfirmed() {
    const self = this;
    this.stateService.model.removeModel(this.modelName).subscribe(response => {
      this.stateService.model.updateListOfModels();
      this.toastr.success('Model deleted successfully');
      if (self.model.get('name') === self.modelName) {
        this.router.navigate(['/']);
      }
      this.activeModal.close();
    }, handleError.bind(self));
  }

}
