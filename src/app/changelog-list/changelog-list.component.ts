import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { Map } from 'immutable';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers/userState';

@Component({
  selector: 'app-changelog-list',
  styleUrls: ['./changelog-list.component.scss'],
  templateUrl: './changelog-list.component.html',
})
export class ChangelogListComponent implements OnInit, OnChanges {
  @Input() twiglet: Map<string, any>;
  changelog: string[];
  currentTwigletId: string;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentTwigletId = this.twiglet.get('_id');
    if (this.currentTwigletId) {
      this.stateService.twiglet.changeLogService.getChangelog(this.currentTwigletId).subscribe(res => {
        this.changelog = res.changelog;
        this.cd.markForCheck();
      });
    }
  }

}
