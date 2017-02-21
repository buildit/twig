import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { Map } from 'immutable';

import { StateService } from '../state.service';

@Component({
  selector: 'app-changelog-list-model',
  styleUrls: ['./changelog-list-model.component.scss'],
  templateUrl: './changelog-list-model.component.html',
})
export class ChangelogListModelComponent implements OnInit, OnChanges {
  @Input() model: Map<string, any>;
  changelog: any[];
  currentModelName: string;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  /**
   * Gets fired whenever the model changes so that the updated changelog can be loaded.
   *
   * @param {SimpleChanges} changes
   *
   * @memberOf ChangelogListModelComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    this.currentModelName = this.model.get('name');
    if (this.currentModelName) {
      const changelog_url = this.model.get('changelog_url');
      this.stateService.model.getChangelog(changelog_url).subscribe(response => {
        this.changelog = response.changelog;
      });
    }
  }

}
