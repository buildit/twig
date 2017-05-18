import { StateService } from './../../state.service';
import { Component, Input, OnInit } from '@angular/core';

import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  selector: 'app-header-twiglet',
  styleUrls: ['./header-twiglet.component.scss'],
  templateUrl: './header-twiglet.component.html',
})
export class HeaderTwigletComponent {
  @Input() twiglet;
  @Input() twiglets;
  @Input() models;
  @Input() userState;
  @Input() twigletChangelog;

  constructor(private stateService: StateService) { }

  setRenderEveryTick($event) {
    this.stateService.userState.setRenderOnEveryTick($event.target.checked);
  }

}
