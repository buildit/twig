import { UserState } from './../../non-angular/interfaces/userState/index';
import { StateService } from './../state.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-left-sidebar',
  styleUrls: ['./twiglet-left-sidebar.component.scss'],
  templateUrl: './twiglet-left-sidebar.component.html',
})
export class TwigletLeftSidebarComponent implements OnInit {

  @Input() userState;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  toggleTypeActive(type) {
    this.stateService.userState.toggleTypeFilterActive(type);
  }

  removeType(type) {
    this.stateService.userState.removeTypeFilter(type);
  }

  toggleAttributeActive(attr) {
    this.stateService.userState.toggleAttributeFilterActive(attr.get('key'), attr.get('value'));
  }

  removeAttribute(attr) {
    this.stateService.userState.removeAttributeFilter(attr.get('key'), attr.get('value'));
  }

}
