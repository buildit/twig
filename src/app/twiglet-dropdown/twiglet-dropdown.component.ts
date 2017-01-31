import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { DeleteTwigletConfirmationComponent } from './../delete-twiglet-confirmation/delete-twiglet-confirmation.component';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent {
  twiglets: string[];

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
  }

  handleErrors(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  loadTwiglet(id: string) {
    this.router.navigate(['/twiglet', id]);
  }

  deleteTwiglet(id: string, name: string) {
    const modelRef = this.modalService.open(DeleteTwigletConfirmationComponent);
    modelRef.componentInstance.twigletId = id;
    modelRef.componentInstance.twigletName = name;
  }

  openNewModal() {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
  }

  cloneTwiglet(twiglet) {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    modelRef.componentInstance.clone = twiglet;
  }

}
