import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AboutTwigletModalComponent } from './../about-twiglet-modal/about-twiglet-modal.component';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { DeleteTwigletConfirmationComponent } from './../../shared/delete-confirmation/delete-twiglet-confirmation.component';
import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { StateService } from '../../state.service';
import { UserState } from './../../../non-angular/interfaces';

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

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router, private toastr: ToastsManager) { }

  loadTwiglet(name: string) {
    this.router.navigate(['/twiglet', name]);
  }

  deleteTwiglet(name: string) {
    const modelRef = this.modalService.open(DeleteTwigletConfirmationComponent);
    const component = <DeleteTwigletConfirmationComponent>modelRef.componentInstance;
    component.twiglet = this.twiglet;
    component.resourceName = name;
  }

  renameTwiglet(twigletName) {
    const modelRef = this.modalService.open(EditTwigletDetailsComponent);
    const component = <EditTwigletDetailsComponent>modelRef.componentInstance;
    component.setupTwigletLists(this.twiglets);
    component.twigletName = twigletName;
    component.currentTwiglet = this.twiglet.get('name');
  }

  openAbout(twigletName, twigletDescription, currentTwiglet) {
    const modelRef = this.modalService.open(AboutTwigletModalComponent, { size: 'lg' });
    const component = <AboutTwigletModalComponent>modelRef.componentInstance;
    component.twigletName = twigletName;
    component.description = twigletDescription;
    component.currentTwiglet = this.twiglet.get('name');
    component.userState = this.userState;
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
    component.clone = twiglet;
  }

}
