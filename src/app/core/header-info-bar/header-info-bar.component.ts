import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderedMap } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { Model } from './../../../non-angular/interfaces/model/index';
import { PingComponent } from './../ping/ping.component';
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

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public router: Router,
    public modalService: NgbModal) {
  }

  goHome() {
    this.stateService.userState.setActiveModel(false);
    this.stateService.userState.setActiveTwiglet(false);
    this.router.navigate(['/']);
  }

  openPing() {
    const modelRef = this.modalService.open(PingComponent);
    const component = <PingComponent>modelRef.componentInstance;
    component.setup(this.userState);
  }
}
