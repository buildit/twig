import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderedMap } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { Model } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent {
  @Input() userState: OrderedMap<string, any> = OrderedMap({});
  @Input() twiglet: OrderedMap<string, any> = OrderedMap({});
  @Input() model: OrderedMap<string, any> = OrderedMap({});
  modelUrl: boolean;
  twigletUrl: boolean;
  routeSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, private router: Router) {  }

  goHome() {
    this.stateService.userState.setActiveModel(false);
    this.stateService.userState.setActiveTwiglet(false);
    this.router.navigate(['/']);
  }
}
