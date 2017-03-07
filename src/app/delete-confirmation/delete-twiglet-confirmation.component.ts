import { Map } from 'immutable';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Subscription } from 'rxjs/Subscription';
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
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteTwigletConfirmationComponent {
  twiglet: Map<string, any> = Map({});
  userState: UserState;
  resourceName: string;
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
    this.stateService.twiglet.removeTwiglet(this.resourceName).subscribe(
      response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.toastr.success('Twiglet deleted successfully');
        if (self.twiglet.get('name') === self.resourceName) {
          this.router.navigate(['/']);
        }
        this.activeModal.close();
      },
      handleError.bind(self));
  }
}
