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
  currentTwigletName: string;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentTwigletName = this.twiglet.get('name');
    if (this.currentTwigletName) {
      this.stateService.twiglet.changeLogService.getChangelog(this.currentTwigletName).subscribe(res => {
        this.changelog = res.changelog;
        this.cd.markForCheck();
      });
    }
  }

}
