import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';

import { CreateModelModalComponent } from './../create-model-modal/create-model-modal.component';
import { ModelChangelog } from './../../../non-angular/interfaces/model/index';
import { StateService } from './../../state.service';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-header-model',
  styleUrls: ['./header-model.component.scss'],
  templateUrl: './header-model.component.html',
})
export class HeaderModelComponent {
  @Input() models;
  @Input() model;
  @Input() userState;
  MODEL = MODEL_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private stateService: StateService, public modalService: NgbModal) {
  }

  createNewModel() {
    const modelRef = this.modalService.open(CreateModelModalComponent);
    const component = <CreateModelModalComponent>modelRef.componentInstance;
    component.setupModelLists(this.models);
  }

  startEditing() {
    this.stateService.userState.setEditing(true);
  }
}
