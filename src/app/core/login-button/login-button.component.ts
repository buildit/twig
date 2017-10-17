import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderedMap } from 'immutable';

import { LoginModalComponent } from '../login-modal/login-modal.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent {
  @Input() userState: OrderedMap<string, any> = OrderedMap({});
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public modalService: NgbModal, private cd: ChangeDetectorRef, private stateService: StateService, private router: Router) { }

  openLoginModal() {
    const modelRef = this.modalService.open(LoginModalComponent);
  }

  logOut() {
    this.stateService.userState.logOut();
    this.router.navigate(['/']);
  }

}
