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
  filterType: string;
  subscription: Subscription;
  userState: UserState;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stateService.twiglet.model.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.entityNames = Object.keys(response.get('entities').toJS());
    });
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
  }

  selectEntity(entity) {
    this.stateService.userState.setFilterEntity(entity);
  }

}
