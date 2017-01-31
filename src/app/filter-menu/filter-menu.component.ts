import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Map, OrderedMap } from 'immutable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-filter-menu',
  styleUrls: ['./filter-menu.component.scss'],
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent implements OnInit {
  changeDetection: ChangeDetectionStrategy.OnPush;
  entityNames: string[];
  filterType: String[];
  subscription: Subscription;
  userState: Map<string, any>;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stateService.twiglet.modelService.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.entityNames = Object.keys(response.get('entities').toJS());
    });
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.filterType = response.get('filterEntities');
      this.cd.markForCheck();
    });
  }

  selectEntity(entity) {
    if (this.filterType.indexOf(entity) === -1) {
      this.filterType.push(entity);
    } else {
      let i = this.filterType.indexOf(entity);
      this.filterType.splice(i, 1);
    }
    this.stateService.userState.setFilterEntities(this.filterType);
  }

  checkFilter(entity) {
    for (let i = 0; i < this.filterType.length; i++) {
      if (this.filterType[i] === entity) {
        return true;
      }
    }
  }

  emptyFilter() {
    this.filterType.length = 0;
    this.stateService.userState.setFilterEntities(this.filterType);
  }

}
