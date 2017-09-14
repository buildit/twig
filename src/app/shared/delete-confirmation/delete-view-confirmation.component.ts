import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from './../../../non-angular/interfaces/userState/index';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';

@Component({
  selector: 'app-delete-view-confirmation',
  styleUrls: ['./delete-confirmation.component.scss'],
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteViewConfirmationComponent implements OnInit {
  @ViewChild('autofocus') private elementRef: ElementRef;
  view: Map<string, any>;
  resourceName: string;
  inputName: string;
  twiglet: Map<string, any> = Map({});
  userState: Map<string, any> = Map({});
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;

  constructor(public stateService: StateService,
              public modalService: NgbModal,
              public router: Router,
              public toastr: ToastsManager,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.focus();
  }

  setup(view: Map<string, any>, twiglet: Map<string, any>, userState: Map<string, any>) {
    this.view = view;
    this.twiglet = twiglet;
    this.userState = userState;
    this.resourceName = view.get(this.VIEW.NAME);
  }

  /**
   * Runs when the user presses Delete
   *
   *
   * @memberOf DeleteViewConfirmationComponent
   */
  deleteConfirmed() {
    const self = this;
    this.stateService.userState.startSpinner();
    this.stateService.twiglet.viewService.deleteView(this.view.get(this.VIEW.URL)).subscribe(
      response => {
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
        if (self.view.get(this.VIEW.NAME) === this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
          this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME)]);
        }
      });
  }
}
