import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';

import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-details',
  styleUrls: ['./model-details.component.scss'],
  templateUrl: './model-details.component.html',
})
export class ModelDetailsComponent implements OnInit {
  @Input() model;
  modelChangelog: List<Map<string, any>> = List([]);

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public modalService: NgbModal) {
    stateService.model.changeLogService.observable.subscribe(changelog => {
      this.modelChangelog = changelog;
      this.cd.markForCheck();
    });
   }

  ngOnInit() {
  }

  openChangelog(modelName) {
    const modelRef = this.modalService.open(ChangelogListComponent, { size: 'lg' });
    const component = <ChangelogListComponent>modelRef.componentInstance;
    component.changelog = this.modelChangelog;
  }

}
