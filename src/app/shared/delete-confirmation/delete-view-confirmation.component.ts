import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from './../../../non-angular/interfaces/userState/index';

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

  constructor(public stateService: StateService,
              public modalService: NgbModal,
              public router: Router,
              public toastr: ToastsManager,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.elementRef) {
      this.elementRef.nativeElement.focus();
    }
  }

  setup(view: Map<string, any>, twiglet: Map<string, any>, userState: Map<string, any>) {
    this.view = view;
    this.twiglet = twiglet;
    this.userState = userState;
    this.resourceName = view.get('name');
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
    this.stateService.twiglet.viewService.deleteView(this.view.get('url')).subscribe(
      response => {
        this.stateService.userState.stopSpinner();
        this.activeModal.close();
        if (self.view.get('name') === this.userState.get('currentViewName')) {
          this.router.navigate(['/twiglet', this.twiglet.get('name')]);
        }
      });
  }
}
