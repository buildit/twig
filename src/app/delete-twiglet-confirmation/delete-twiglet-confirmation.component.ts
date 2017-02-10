import { Map } from 'immutable';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';

@Component({
  selector: 'app-delete-twiglet-confirmation',
  styleUrls: ['./delete-twiglet-confirmation.component.scss'],
  templateUrl: './delete-twiglet-confirmation.component.html',
})
export class DeleteTwigletConfirmationComponent {
  twiglet: Map<string, any> = Map({});
  userState: UserState;
  twigletName: string;
  inputName: string;
  twigletSubscription: Subscription;

  constructor(public stateService: StateService,
              public modalService: NgbModal,
              public router: Router,
              public toastr: ToastsManager,
              public activeModal: NgbActiveModal) {
  }

  deleteConfirmed() {
    const self = this;
    this.stateService.twiglet.removeTwiglet(this.twigletName).subscribe(
      response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.toastr.success('Twiglet deleted successfully');
        if (self.twiglet.get('name') === self.twigletName) {
          this.router.navigate(['/']);
        }
        this.activeModal.close();
      },
      handleError.bind(self));
  }
}
