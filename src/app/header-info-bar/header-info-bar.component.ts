import { OrderedMap } from 'immutable';
import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
import { Model } from './../../non-angular/interfaces/model/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent implements AfterViewChecked {
  @Input() userState: OrderedMap<string, any> = OrderedMap({});
  @Input() twiglet: OrderedMap<string, any> = OrderedMap({});
  @Input() model: OrderedMap<string, any> = OrderedMap({});
  modelUrl: boolean;
  routeSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, private router: Router) {  }

  ngAfterViewChecked() {
    this.routeSubscription = this.router.events.subscribe((url) => {
      if (url.url.startsWith('/model')) {
        this.modelUrl = true;
      } else {
        this.modelUrl = false;
      }
    });
  }
}
