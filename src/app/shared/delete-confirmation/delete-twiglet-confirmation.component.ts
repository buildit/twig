import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from './../../../non-angular/interfaces/userState/index';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

@Component({
  selector: 'app-delete-twiglet-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteTwigletConfirmationComponent implements OnInit {
  @ViewChild('autofocus') private elementRef: ElementRef;
  twiglet: Map<string, any> = Map({});
  userState: UserState;
  resourceName: string;
  inputName: string;
  TWIGLET = TWIGLET_CONSTANTS;

  constructor(public stateService: StateService,
    public modalService: NgbModal,
    public router: Router,
    public toastr: ToastsManager,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.focus();
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
        this.toastr.success('Twiglet deleted successfully', null);
        if (self.twiglet.get(this.TWIGLET.NAME) === self.resourceName) {
          this.router.navigate(['/twiglet']);
        }
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
      },
      handleError.bind(self));
  }
}
