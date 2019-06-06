import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { StateService } from './../../state.service';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import EVENT_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/event';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumb-navigation',
  styleUrls: ['./breadcrumb-navigation.component.scss'],
  templateUrl: './breadcrumb-navigation.component.html',
})
export class BreadcrumbNavigationComponent implements OnInit {
  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  @Input() eventsList: Map<string, any>
  @Input() views;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  EVENT = EVENT_CONSTANTS;
  EDIT_BUTTON = Object.freeze({
    DISABLED: 'disabled',
    TWIGLET: 'twiglet',
    VIEW: 'view'
  })

  constructor(private stateService: StateService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
  }

  correctEditButton() {
    if (!this.userState.get(this.USERSTATE.CURRENT_EVENT)
      && !this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)
      && this.userState.get(this.USERSTATE.USER))  {
      return this.EDIT_BUTTON.TWIGLET;
    }

    if (this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)
      && this.userState.get(this.USERSTATE.USER)) {
      return this.EDIT_BUTTON.VIEW;
    }

    return this.EDIT_BUTTON.DISABLED;
  }

  goHome() {
    this.stateService.userState.setCurrentEvent(null);
    if (this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME)])
    } else {
      this.stateService.twiglet.loadTwiglet(this.twiglet.get(this.TWIGLET.NAME)).subscribe(() => undefined);
    }
  }

  clearView() {
    this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME)])
  }

  canGoToDefault() {
    return this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME) ||
      this.userState.get(this.USERSTATE.CURRENT_EVENT);
  }

  getEventName() {
    return this.eventsList.getIn([this.userState.get(this.USERSTATE.CURRENT_EVENT), this.EVENT.NAME]);
  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.views = this.views;
    component.twigletName = this.twiglet.get(this.TWIGLET.NAME);
  }

  startEditingTwiglet() {
    this.stateService.twiglet.createBackup();
    this.stateService.userState.setFormValid(true);
    this.stateService.userState.setEditing(true);
  }

  startEditingView() {
    this.stateService.twiglet.viewService.createBackup();
    this.stateService.userState.setViewEditing(true);
  }
}
