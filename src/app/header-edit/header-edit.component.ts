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
  model = { entities: {} };
  twigletModelSubscription: Subscription;


  constructor(public modalService: NgbModal, private stateService: StateService, private cd: ChangeDetectorRef) {
    this.twigletModelSubscription = this.stateService.twiglet.modelService.observable.subscribe(model => {
      this.model = model.toJS();
      this.cd.markForCheck();
    });
    this.userStateSubscription = this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
    });
  }

  ngOnDestroy() {
    this.twigletModelSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }
}
