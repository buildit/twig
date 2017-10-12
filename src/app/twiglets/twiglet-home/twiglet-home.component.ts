import { TwigletModelViewComponent } from './../twiglet-model-view/twiglet-model-view.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Map, List, OrderedMap } from 'immutable';

import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-home',
  styleUrls: ['./twiglet-home.component.scss'],
  templateUrl: './twiglet-home.component.html',
})
export class TwigletHomeComponent implements OnInit {
  @ViewChild(TwigletModelViewComponent) modelEditor: TwigletModelViewComponent;
  dirtyTwiglet: boolean;
  dirtyTwigletModel: boolean;
  dirtyView: boolean;
  twiglet: Map<string, any> = Map({});
  twigletModel: Map<string, any> = Map({});
  viewData: Map<string, any> = Map({});
  view: Map<string, any> = Map({});
  views: List<any> = List();
  twiglets: List<Object>;
  models: List<Object>;
  eventsList: OrderedMap<string, Map<string, any>>;
  userState: Map<string, any> = Map({});
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;

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

    stateService.twiglet.viewService.dirty.subscribe(dirty => {
      this.dirtyView = dirty;
      this.cd.markForCheck();
    });

    stateService.twiglet.viewService.observable.subscribe(view => {
      this.view = view;
      this.viewData = view.get(this.VIEW.DATA);
      this.cd.markForCheck();
    });

    stateService.twiglet.viewService.views.subscribe(views => {
      this.views = views;
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

    stateService.twiglet.eventsService.events.subscribe(eventsList => {
      this.eventsList = eventsList;
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

  addEntity($event) {
    this.modelEditor.addEntity();
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
