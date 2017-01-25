import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';
import { clone } from 'ramda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, ModelEntity, UserState } from '../../non-angular/interfaces';
import { getColorFor, getNodeImage } from '../twiglet-graph/nodeAttributesToDOMAttributes';
import { CommitModalComponent } from '../commit-modal/commit-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-edit',
  styleUrls: ['./header-edit.component.scss'],
  templateUrl: './header-edit.component.html',
})
export class HeaderEditComponent implements OnInit {
  userState: UserState;
  subscription: Subscription;
  nodes: {};
  newLinks: {};

  private model = { entities: {} };

  constructor(public modalService: NgbModal, private stateService: StateService, private cd: ChangeDetectorRef) {
    this.stateService.twiglet.modelService.observable.subscribe(response => {
      this.model = response.toJS();
      this.cd.markForCheck();
    });
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
  }

  ngOnInit() {

  }

  discardChanges() {
    this.stateService.twiglet.loadTwiglet(this.userState.currentTwigletId, this.userState.currentTwigletName);
    this.stateService.userState.setEditing(false);
  }

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

}
