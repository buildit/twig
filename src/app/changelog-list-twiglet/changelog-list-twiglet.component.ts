import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { Map } from 'immutable';

import { StateService } from '../state.service';
import { UserState } from './../../non-angular/interfaces/userState/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-list-twiglet',
  styleUrls: ['./changelog-list-twiglet.component.scss'],
  templateUrl: './changelog-list-twiglet.component.html',
})
export class ChangelogListTwigletComponent implements OnInit, OnChanges {
  @Input() twiglet: Map<string, any>;
  changelog: string[];

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  /**
   * Any time a new twiglet is loaded, this is fired to pull the changelog.
   *
   * @param {SimpleChanges} changes the changes being passed through.
   *
   * @memberOf ChangelogListComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.twiglet.get('name')) {
      this.stateService.twiglet.changeLogService.getChangelog(this.twiglet.get('name')).subscribe(res => {
        this.changelog = res.changelog;
        for (let i = 0; i < res.changelog.length; i ++) {
          console.log(res.changelog[i].timestamp);
          const date = new Date(res.changelog[i].timestamp);
          console.log(date);
        }
        this.cd.markForCheck();
      });
    }
  }

}
