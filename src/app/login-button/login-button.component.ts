import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { UserState } from '../../non-angular/interfaces';
import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-button',
  styleUrls: ['./login-button.component.scss'],
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent implements OnInit {
  userState: UserState = {};

  constructor(public modalService: NgbModal, private cd: ChangeDetectorRef, private stateService: StateService) { }

  ngOnInit() {
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
  }

  openLoginModal() {
    const modelRef = this.modalService.open(LoginModalComponent);
  }

  logOut() {
    this.stateService.userState.logOut();
  }

}
