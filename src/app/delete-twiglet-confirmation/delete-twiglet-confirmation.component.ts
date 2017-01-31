import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
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
export class DeleteTwigletConfirmationComponent implements OnDestroy {
  twiglet: Twiglet;
  userState: UserState;
  twigletName: string;
  twigletId: string;
  inputName: string;
  twigletSubscription: Subscription;
  userStateSubscription: Subscription;

  constructor(public stateService: StateService,
              public modalService: NgbModal,
              public router: Router,
              public toastr: ToastsManager,
              public activeModal: NgbActiveModal) {
    this.userStateSubscription = this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
    this.twigletSubscription = this.stateService.twiglet.observable.subscribe(twiglet => {
      this.twigletId = twiglet.get('_id');
      this.twigletName = twiglet.get('name');
    });
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
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
        this.toastr.success('Twiglet deleted successfully');
        if (self.twiglet._id === self.twigletId) {
          this.router.navigate(['/']);
        }
        this.activeModal.close();
      },
      this.handleErrors.bind(self));
  }
}
