import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from './../../../non-angular/interfaces/userState/index';

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

  /**
   * Runs when the user presses Delete
   *
   *
   * @memberOf DeleteTwigletConfirmationComponent
   */
  deleteConfirmed() {
    const self = this;
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.removeTwiglet(this.resourceName).subscribe(
      response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.toastr.success('Twiglet deleted successfully');
        if (self.twiglet.get('name') === self.resourceName) {
          this.router.navigate(['/']);
        }
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
      },
      handleError.bind(self));
  }
}
