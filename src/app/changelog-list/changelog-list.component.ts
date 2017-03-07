import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-list',
  styleUrls: ['./changelog-list.component.scss'],
  templateUrl: './changelog-list.component.html',
})
export class ChangelogListComponent implements OnInit {
  @Input() changelog: List<Map<string, any>>;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

}
