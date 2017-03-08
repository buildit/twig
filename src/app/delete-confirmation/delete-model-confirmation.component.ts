import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Model } from './../../non-angular/interfaces/model';
import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';

@Component({
  selector: 'app-delete-model-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteModelConfirmationComponent implements OnInit {
  model: Map<string, any> = Map({});
  userState: UserState;
  resourceName: string;
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
    this.stateService.model.removeModel(this.resourceName).subscribe(response => {
      this.stateService.model.updateListOfModels();
      this.toastr.success('Model deleted successfully');
      if (self.model.get('name') === self.resourceName) {
        this.router.navigate(['/']);
      }
      this.activeModal.close();
    }, handleError.bind(self));
  }

}
