import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-list',
  styleUrls: ['./view-list.component.scss'],
  templateUrl: './view-list.component.html',
})
export class ViewListComponent {
  @Input() views;
  @Input() twiglet;
  @Input() userState: Map<string, any>;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router ) { }

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

  editView(view) {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.setup(view.get(this.VIEW.URL), view.get(this.VIEW.NAME), view.get(this.VIEW.DESCRIPTION));
    component.views = this.views;
    component.twigletName = this.twiglet.get(this.TWIGLET.NAME);
  }

  deleteView(view) {
    const modelRef = this.modalService.open(DeleteViewConfirmationComponent);
    const component = <DeleteViewConfirmationComponent>modelRef.componentInstance;
    component.setup(view, this.twiglet, this.userState);
  }

}
