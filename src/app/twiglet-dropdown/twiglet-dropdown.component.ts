import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, Input } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces';
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
  @Input() userState;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router, private toastr: ToastsManager) { }

  handleErrors(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  loadTwiglet(name: string) {
    this.stateService.userState.setActiveModel(false);
    this.stateService.userState.setActiveTwiglet(true);
    this.router.navigate(['/twiglet', name]);
  }

  deleteTwiglet(name: string) {
    const modelRef = this.modalService.open(DeleteTwigletConfirmationComponent);
    const component = <DeleteTwigletConfirmationComponent>modelRef.componentInstance;
    component.twiglet = this.twiglet;
    component.twigletName = name;
  }

  renameTwiglet(twigletName) {
    const modelRef = this.modalService.open(EditTwigletDetailsComponent);
    const component = <EditTwigletDetailsComponent>modelRef.componentInstance;
    component.currentTwigletOpenedName = this.twiglet.get('name');
    component.setupTwigletLists(this.twiglets);
    component.twigletName = twigletName;
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
