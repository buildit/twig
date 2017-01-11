import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Map, OrderedMap } from 'immutable';
import { StateService } from '../state.service';

@Component({
  selector: 'app-filter-menu',
  styleUrls: ['./filter-menu.component.scss'],
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent implements OnInit {
  entityNames: string[];
  subscription: Subscription;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.twiglet.model.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.entityNames = Object.keys(response.get('entities').toJS());
    });
  }

}
