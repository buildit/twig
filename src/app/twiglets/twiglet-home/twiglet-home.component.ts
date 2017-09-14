import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Map, List } from 'immutable';

import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-home',
  styleUrls: ['./twiglet-home.component.scss'],
  templateUrl: './twiglet-home.component.html',
})
export class TwigletHomeComponent implements OnInit {
  dirtyTwiglet: boolean;
  dirtyTwigletModel: boolean;
  twiglet: Map<string, any> = Map({});
  twigletModel: Map<string, any> = Map({});
  twiglets: List<Object>;
  models: List<Object>;
  userState: Map<string, any> = Map({});
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      this.cd.markForCheck();
    });

    stateService.twiglet.dirty.subscribe(dirtyTwiglet => this.dirtyTwiglet = dirtyTwiglet);

    stateService.twiglet.modelService.dirty.subscribe(dirtyTwigletModel => this.dirtyTwigletModel = dirtyTwigletModel);

    stateService.twiglet.twiglets.subscribe(twiglets => {
      this.twiglets = twiglets;
      this.cd.markForCheck();
    });

    stateService.model.models.subscribe(models => {
      this.models = models;
      this.cd.markForCheck();
    });

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });

    stateService.twiglet.modelService.observable.subscribe(model => {
      this.twigletModel = model;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.stateService.userState.setMode('twiglet');
  }

  getTwigletGraphClass() {
    if (!this.userState.get(this.USERSTATE.EDIT_TWIGLET_MODEL) && this.userState.get(this.USERSTATE.MODE) === 'twiglet') {
      return 'show';
    }
    return 'no-show';
  }

  getTwigletModelClass() {
    if (this.userState.get(this.USERSTATE.EDIT_TWIGLET_MODEL)) {
      return 'show';
    }
    return 'no-show';
  }

}
