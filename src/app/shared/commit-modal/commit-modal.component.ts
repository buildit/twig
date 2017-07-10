import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers';
import { D3Node, Link, UserState } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';

export interface FormResult {
  commit: string;
  continueEdit: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-commit-modal',
  styleUrls: ['./commit-modal.component.scss'],
  templateUrl: './commit-modal.component.html',
})
export class CommitModalComponent implements OnInit {
  formResult: ReplaySubject<FormResult> = new ReplaySubject();
  form: FormGroup;
  errorMessage;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.buildForm();
  }

  get observable() {
    return this.formResult.asObservable();
  }

  ngOnInit() {
  }

  buildForm() {
    this.form = this.fb.group({
      commit: ['', Validators.required]
    });
  }

  setCommitMessage(message) {
    this.form.patchValue({commit: message});
    this.cd.markForCheck();
  }

  /**
   * Gets fired on save changes
   *
   *
   * @memberOf CommitModalComponent
   */
  saveChanges(boolean) {
    this.formResult.next({ commit: this.form.value.commit, continueEdit: boolean});
  }

  closeModal() {
    this.activeModal.close();
  }
}
