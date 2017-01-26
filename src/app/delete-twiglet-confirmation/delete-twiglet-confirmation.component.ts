import { Component } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers/userState';

@Component({
  selector: 'app-delete-twiglet-confirmation',
  styleUrls: ['./delete-twiglet-confirmation.component.scss'],
  templateUrl: './delete-twiglet-confirmation.component.html',
})
export class DeleteTwigletConfirmationComponent {
  userState: UserState;
  twigletName: string;
  twigletId: string;
  inputName: string;

  constructor(private stateService: StateService,
              private modalService: NgbModal,
              private router: Router,
              private toastr: ToastsManager,
              private activeModal: NgbActiveModal) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }

  handleErrors(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  deleteConfirmed() {
    const self = this;
    this.stateService.twiglet.removeTwiglet(this.twigletId).subscribe(
      response => {
        this.stateService.backendService.updateListOfTwiglets();
        this.toastr.info('Twiglet deleted successfully');
        console.log(self.userState, self.twigletId);
        if (self.userState.currentTwigletId === self.twigletId) {
          this.router.navigate(['/']);
        }
      },
      this.handleErrors.bind(self));
  }

}
