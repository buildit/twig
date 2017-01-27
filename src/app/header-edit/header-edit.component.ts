import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { Twiglet } from './../../non-angular/interfaces/twiglet';
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
export class HeaderEditComponent implements OnDestroy {
  userState: UserState;
  userStateSubscription: Subscription;
  twiglet: Twiglet;
  twigletSubscription: Subscription;

  private model = { entities: {} };

  constructor(public modalService: NgbModal, private stateService: StateService, private cd: ChangeDetectorRef) {
    this.twigletSubscription = this.stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet.toJS();
    });
    this.userStateSubscription = this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.twigletSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }

  discardChanges() {
    this.stateService.twiglet.loadTwiglet(this.twiglet._id);
    this.stateService.userState.setEditing(false);
  }

  saveTwiglet() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

}
