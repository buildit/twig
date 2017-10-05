import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Map } from 'immutable';
import { Subscription } from 'rxjs/Rx';
import { Config } from '../../../non-angular/config'

import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnDestroy, OnInit {
  userState: Map<string, any> = Map({});
  userStateSubscription: Subscription;
  USERSTATE = USERSTATE_CONSTANTS;
  Config = Config;
  temp = '';

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, private http: Http) {
    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
    const url = `${Config.apiUrl}/ping`;
    const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });
    const authSetDataOptions = new RequestOptions({ headers: jsonHeaders, withCredentials: true });
    this.http.get(url, authSetDataOptions)
    .map((res: Response) => res.json())
    .subscribe(
      response => { this.temp = JSON.stringify(response); this.cd.markForCheck(); },
      error => { this.temp = error; this.cd.markForCheck(); },
    );
  }

  ngOnInit() {
    this.stateService.userState.setMode('about');
  }

  ngOnDestroy() {
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }

}
