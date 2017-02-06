import { List } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, Input } from '@angular/core';
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
  @Input() twiglets;
  @Input() models;
  @Input() twiglet;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router, private toastr: ToastsManager) { }

  handleErrors(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  loadTwiglet(id: string) {
    this.router.navigate(['/twiglet', id]);
  }

  deleteTwiglet(id: string, name: string) {
    const modelRef = this.modalService.open(DeleteTwigletConfirmationComponent);
    const component = <DeleteTwigletConfirmationComponent>modelRef.componentInstance;
    component.twiglet = this.twiglet;
    component.twigletId = id;
    component.twigletName = name;
  }

  openNewModal() {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    const component = <CreateTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletAndModelLists(this.twiglets, this.models);
  }

  cloneTwiglet(twiglet) {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    const component = <CreateTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletAndModelLists(this.twiglets, this.models);
    modelRef.componentInstance.clone = twiglet;
  }

}
