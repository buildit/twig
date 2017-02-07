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
  changelog: string[];
  currentModelId: string;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentModelId = this.model.get('_id');
    console.log(this.currentModelId);
  }

}
