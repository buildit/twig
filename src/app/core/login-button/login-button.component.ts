import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderedMap } from 'immutable';

import { LoginModalComponent } from '../login-modal/login-modal.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-button',
  styleUrls: ['./login-button.component.scss'],
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent implements OnInit {
  @Input() userState: OrderedMap<string, any> = OrderedMap({});

  constructor(public modalService: NgbModal, private cd: ChangeDetectorRef, private stateService: StateService) { }

  ngOnInit() { }

  openLoginModal() {
    const modelRef = this.modalService.open(LoginModalComponent);
  }

  logOut() {
    this.stateService.userState.logOut();
  }

}
