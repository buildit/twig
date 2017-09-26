import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import { Map } from 'immutable';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../../state.service';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-dropdown',
  styleUrls: ['./view-dropdown.component.scss'],
  templateUrl: './view-dropdown.component.html',
})
export class ViewDropdownComponent implements OnInit {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;

  constructor(private stateService: StateService, private router: Router, private modalService: NgbModal ) { }

  ngOnInit() {
  }

  loadView(name) {
    this.stateService.userState.setCurrentView(name);
    this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME), 'view', name]);
  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.views = this.views;
    component.twigletName = this.twiglet.get(this.TWIGLET.NAME);
  }

  deleteView(view) {
    const modelRef = this.modalService.open(DeleteViewConfirmationComponent);
    const component = <DeleteViewConfirmationComponent>modelRef.componentInstance;
    component.setup(view, this.twiglet, this.userState);
  }
}
