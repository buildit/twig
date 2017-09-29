import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Map, List } from 'immutable';

import { StateService } from './../../state.service';
import VIEW from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

interface AzureAdReturn {
  id_token?: string;
  session_state?: string;
  state?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-splash',
  styleUrls: ['./splash.component.scss'],
  templateUrl: './splash.component.html',
})
export class SplashComponent implements OnDestroy {
  twiglets: List<any> = List();
  twigletsSubscription: Subscription;
  models: List<any> = List();
  modelsSubscription: Subscription;
  twiglet: Map<string, any> = Map({});
  twigletSubscription: Subscription;
  userState: Map<string, any> = Map({});
  userStateSubscription: Subscription;
  twigletTypeToCreate = 'existingModel';
  USERSTATE = USERSTATE_CONSTANTS

  constructor(private router: Router,
      stateService: StateService,
      toastr: ToastsManager,
      private cd: ChangeDetectorRef,
      public modalService: NgbModal) {
    const url = this.router.url.substring(2);
    const params = url.split('&');
    const returnParams: AzureAdReturn = params.reduce((object, param) => {
      const [ key, value ] = param.split('=');
      object[key] = decodeURIComponent(value);
      return object;
    }, {});
    if (returnParams.id_token) {
      stateService.userState.loginViaMothershipAd(returnParams.id_token).subscribe(user => {
        toastr.success(`Logged in as ${user.name}`);
      });
      const route = returnParams.state.split('%2f');
      this.router.navigate(!route[1] || route[1] === '' ? ['/'] : route);
    }

    this.twigletsSubscription = stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });

    this.modelsSubscription = stateService.twiglet.twiglets.subscribe(twiglets => {
      this.twiglets = twiglets;
      this.cd.markForCheck();
    });

    this.twigletSubscription = stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });

    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });

  }

  ngOnDestroy() {
    this.twigletsSubscription.unsubscribe();
    this.modelsSubscription.unsubscribe();
    this.twigletsSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }

  switchTwigletTypeToCreate(type) {
    this.twigletTypeToCreate = type;
  }

  createNewTwiglet() {
    if (this.twigletTypeToCreate === 'json') {
      const modelRef = this.modalService.open(CreateTwigletModalComponent);
      const component = <CreateTwigletModalComponent>modelRef.componentInstance;
      component.setupTwigletAndModelLists(this.twiglets, this.models);
      component.fileString = 'json';
    } else {
      const modelRef = this.modalService.open(CreateTwigletModalComponent);
      const component = <CreateTwigletModalComponent>modelRef.componentInstance;
      component.setupTwigletAndModelLists(this.twiglets, this.models);
      component.useModel = true;
    }
  }
}
