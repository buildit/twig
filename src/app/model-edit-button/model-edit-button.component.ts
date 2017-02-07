import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from './../state.service';
import { CommitModalComponent } from '../commit-modal/commit-modal.component';

@Component({
  selector: 'app-model-edit-button',
  styleUrls: ['./model-edit-button.component.scss'],
  templateUrl: './model-edit-button.component.html',
})
export class ModelEditButtonComponent implements OnInit {
  @Input() userState;

  constructor(private stateService: StateService, public modalService: NgbModal) {
  }

  ngOnInit() {
  }

  startEditing() {
    this.stateService.userState.setEditing(true);
  }

  saveModel() {
    const modelRef = this.modalService.open(CommitModalComponent);
  }

  discardChanges() {
    this.stateService.userState.setFormValid(true);
    this.stateService.model.restoreBackup();
    this.stateService.userState.setEditing(false);
  }

}
