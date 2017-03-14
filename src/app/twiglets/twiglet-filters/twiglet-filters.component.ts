import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filters',
  styleUrls: ['./twiglet-filters.component.scss'],
  templateUrl: './twiglet-filters.component.html',
})
export class TwigletFiltersComponent implements OnInit {

  @Input() userState;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  updateFilters($event) {
    this.stateService.userState.setFilter($event.target.value);
  }

}
