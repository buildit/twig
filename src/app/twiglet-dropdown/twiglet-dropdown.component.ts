import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers/userState';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent {
  twiglets: string[];
  userState: UserState;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router, private toastr: ToastsManager) {
    this.stateService.backendService.observable.subscribe(response => {
      this.twiglets = response.get('twiglets').toJS().sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    });
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject);
  }

  handleErrors(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  loadTwiglet(id: string) {
    console.log('here?');
    this.router.navigate(['/twiglet', id]);
  }

  deleteTwiglet(id: string) {
    const self = this;
    this.stateService.twiglet.removeTwiglet(id).subscribe(
      response => {
        this.stateService.backendService.updateListOfTwiglets();
        this.toastr.info('Twiglet deleted successfully');
        if (self.userState.currentTwigletId === id) {
          this.router.navigate(['/']);
        }
      },
      this.handleErrors.bind(self));
  }

  openNewModal() {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
  }

}
