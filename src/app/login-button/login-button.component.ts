import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { UserState } from '../../non-angular/interfaces';

@Component({
  selector: 'app-login-button',
  styleUrls: ['./login-button.component.scss'],
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent implements OnInit {
  userState: UserState = { user: null } ;

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
    if (this.userState.user) {
      console.log(this.userState.user);
    }
  }

  openLoginModal() {
    const modelRef = this.modalService.open(LoginModalComponent);
  }

}
