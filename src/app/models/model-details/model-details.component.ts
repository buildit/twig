import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { StateService } from './../../state.service';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-details',
  styleUrls: ['./model-details.component.scss'],
  templateUrl: './model-details.component.html',
})
export class ModelDetailsComponent implements OnDestroy {
  @Input() model;
  modelChangelog: List<Map<string, any>> = List([]);
  changelogSubscription: Subscription;
  MODEL = MODEL_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public modalService: NgbModal) {
    this.changelogSubscription = stateService.model.changeLogService.observable.subscribe(changelog => {
      this.modelChangelog = changelog;
      this.cd.detectChanges();
      this.cd.markForCheck();
    });
   }

  ngOnDestroy() {
    this.changelogSubscription.unsubscribe();
  }

  openChangelog(modelName) {
    const modelRef = this.modalService.open(ChangelogListComponent, { size: 'lg' });
    const component = <ChangelogListComponent>modelRef.componentInstance;
    component.changelog = this.modelChangelog;
  }

}
