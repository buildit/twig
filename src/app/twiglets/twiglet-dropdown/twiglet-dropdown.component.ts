import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AboutTwigletModalComponent } from './../about-twiglet-modal/about-twiglet-modal.component';
import { CreateTwigletModalComponent } from '../create-twiglet-modal/create-twiglet-modal.component';
import { DeleteTwigletConfirmationComponent } from './../../shared/delete-confirmation/delete-twiglet-confirmation.component';
import { RenameTwigletModalComponent } from './../rename-twiglet-modal/rename-twiglet-modal.component';
import { StateService } from '../../state.service';
import { UserState } from './../../../non-angular/interfaces';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent implements OnInit {
  @Input() twiglets;
  @Input() models;
  @Input() twiglet: Map<string, any>;
  @Input() userState: Map<string, any>;
  currentTwiglet;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router,
    private toastr: ToastsManager, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentTwiglet = this.twiglet;
    this.cd.markForCheck();
  }

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
    const modelRef = this.modalService.open(RenameTwigletModalComponent);
    const component = <RenameTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletLists(this.twiglets);
    component.twigletName = twigletName;
    component.currentTwiglet = this.twiglet.get(this.TWIGLET.NAME);
  }

  openAbout(twigletName, twigletDescription) {
    const modelRef = this.modalService.open(AboutTwigletModalComponent, { size: 'lg' });
    const component = <AboutTwigletModalComponent>modelRef.componentInstance;
    component.twigletName = twigletName;
    component.description = twigletDescription;
    component.currentTwiglet = this.twiglet.get(this.TWIGLET.NAME);
    component.userState = this.userState;
  }

  cloneTwiglet(twiglet) {
    const modelRef = this.modalService.open(CreateTwigletModalComponent);
    const component = <CreateTwigletModalComponent>modelRef.componentInstance;
    component.setupTwigletAndModelLists(this.twiglets, this.models);
    component.clone = twiglet;
  }

}
