import { DomSanitizer } from '@angular/platform-browser';
import { ModuleWithProviders, ChangeDetectorRef } from '@angular/core';
import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from './state.service';
import USERSTATE_CONSTANTS from '../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  userState: Map<string, any>;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private toastr: ToastsManager, vRef: ViewContainerRef, stateService: StateService, private _sanitizer: DomSanitizer) {
    this.toastr.setRootViewContainerRef(vRef);

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
    });
  }

  getSideBarStyle() {
    if (this.userState.get(this.USERSTATE.MODE) !== 'home') {
      return this._sanitizer.bypassSecurityTrustStyle('flex: 0 0 250px;');
    }
    return this._sanitizer.bypassSecurityTrustStyle('flex: 0 0 0;');
  }

}
