import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers/userState';

@Component({
  selector: 'app-changelog-list',
  styleUrls: ['./changelog-list.component.scss'],
  templateUrl: './changelog-list.component.html',
})
export class ChangelogListComponent implements OnInit {
  changelog: string[];
  currentTwigletId: string;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stateService.twiglet.observable.subscribe(response => {
      this.currentTwigletId = response.get('_id');
      if (this.currentTwigletId) {
        this.stateService.twiglet.changeLogService.getChangelog(this.currentTwigletId).subscribe(res => {
          this.changelog = res.changelog;
        });
      }
      this.cd.markForCheck();
    });
  }

}
