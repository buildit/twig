import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { CreateTwigletModalComponent } from '../twiglets/create-twiglet-modal/create-twiglet-modal.component';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';
import { Twiglet } from './../../non-angular/interfaces/twiglet';

@Component({
  selector: 'app-delete-view-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteViewConfirmationComponent {
  view: Map<string, any>;
  resourceName: string;
  inputName: string;

  constructor(public stateService: StateService,
              public modalService: NgbModal,
              public router: Router,
              public toastr: ToastsManager,
              public activeModal: NgbActiveModal) {
  }

  setup(view: Map<string, any>) {
    this.view = view;
    this.resourceName = view.get('name');
  }

  deleteConfirmed() {
    const self = this;
    this.stateService.twiglet.viewService.deleteView(this.view.get('url')).subscribe(
      response => {
        this.activeModal.close();
      });
  }
}
