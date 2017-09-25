import { Router } from '@angular/router';
import { StateService } from './../../state.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Map } from 'immutable';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import EVENT_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/event';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumb-navigation',
  styleUrls: ['./breadcrumb-navigation.component.scss'],
  templateUrl: './breadcrumb-navigation.component.html',
})
export class BreadcrumbNavigationComponent implements OnInit {
  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  @Input() eventsList: Map<string, any>
  @Input() views;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  EVENT = EVENT_CONSTANTS;

  constructor(private stateService: StateService, private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    this.stateService.userState.setCurrentEvent(null);
    if (this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME)) {
      this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME)])
    } else {
      this.stateService.twiglet.loadTwiglet(this.twiglet.get(this.TWIGLET.NAME)).subscribe(() => undefined);
    }
  }

  canGoToDefault() {
    return this.userState.get(this.USERSTATE.CURRENT_VIEW_NAME) ||
      this.userState.get(this.USERSTATE.CURRENT_EVENT);
  }

  getEventName() {
    return this.eventsList.get(this.userState.get(this.USERSTATE.CURRENT_EVENT)).get(this.EVENT.NAME)
  }

}
