import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { StateService } from '../state.service';
import { D3Node, Link, UserState } from '../../non-angular/interfaces';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-commit-modal',
  styleUrls: ['./commit-modal.component.scss'],
  templateUrl: './commit-modal.component.html',
})
export class CommitModalComponent implements OnInit {
  userState: UserState;
  form: FormGroup;
  errorMessage: string = '';

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      commit: ['', Validators.required]
    });
  }

  saveChanges() {
    this.stateService.twiglet.saveChanges(this.form.value.commit).subscribe(response => {
        this.stateService.userState.setEditing(false);
        this.activeModal.close();
      },
      error => {
        this.errorMessage = 'Something went wrong saving your changes.';
        console.error(error);
      });
  }
}
