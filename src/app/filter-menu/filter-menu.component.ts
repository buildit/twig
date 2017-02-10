import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Map, List } from 'immutable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';

@Component({
  selector: 'app-filter-menu',
  styleUrls: ['./filter-menu.component.scss'],
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent implements OnInit, OnChanges {
  @Input() twigletModel: Map<string, any>;
  @Input() userState: Map<string, any>;
  entityNames: string[];

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.entityNames = this.twigletModel.get('entities').keys();
  }

  selectEntity(entity) {
    let filters = <List<string>>this.userState.get('filterEntities');
    if (!filters.includes(entity)) {
      filters = filters.push(entity);
    } else {
      filters = filters.remove(filters.indexOf(entity));
    }
    this.stateService.userState.setFilterEntities(filters);
  }

  checkFilter(entity) {
    const filters = <List<string>>this.userState.get('filterEntities');
    return filters.some(filter => filter === entity);
  }

  emptyFilter() {
    this.stateService.userState.setFilterEntities(List([]));
  }

}
