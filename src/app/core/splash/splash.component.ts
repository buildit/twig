import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StateService } from './../../state.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

interface AzureAdReturn {
  id_token?: string;
  session_state?: string;
  state?: string;
}

@Component({
  selector: 'app-splash',
  styleUrls: ['./splash.component.scss'],
  templateUrl: './splash.component.html',
})
export class SplashComponent implements OnInit {
  public splashImage: string;

  constructor(private router: Router, stateService: StateService, toastr: ToastsManager) {
    const url = this.router.url.substring(2);
    const params = url.split('&');
    const returnParams: AzureAdReturn = params.reduce((object, param) => {
      const [ key, value ] = param.split('=');
      object[key] = decodeURIComponent(value);
      return object;
    }, {});
    if (returnParams.id_token) {
      stateService.userState.loginViaWiproAd(returnParams.id_token).subscribe(user => {
        toastr.success(`Logged in as ${user.name}`);
      });
      const route = returnParams.state.split('%2f');
      this.router.navigate(!route[1] || route[1] === '' ? ['/'] : route);
    }
  }

  ngOnInit() {
    this.splashImage = '../../../../assets/images/twig-splash.png';
  }
}
