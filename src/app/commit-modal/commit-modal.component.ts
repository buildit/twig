import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { StateService } from '../state.service';
import { D3Node, Link, UserState } from '../../non-angular/interfaces';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-commit-modal',
  styleUrls: ['./commit-modal.component.scss'],
  templateUrl: './commit-modal.component.html',
})
export class CommitModalComponent implements OnInit {
  userState: UserState;
  form: FormGroup;
  subscription: Subscription;
  newNodes: {};
  nodesArray: D3Node[] = [];
  newLinks: {};
  linksArray: Link[] = [];
  errorMessage: string = '';

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = this.stateService.twiglet.observable.subscribe(response => {
      this.newNodes = response.toJS().nodes;
      this.newLinks = response.toJS().links;
    });
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      commit: ['', Validators.required]
    });
  }

  saveChanges() {
    this.subscription.unsubscribe();
    this.nodesArray.length = 0;
    this.linksArray.length = 0;
    Object.keys(this.newNodes).forEach(key => {
      this.nodesArray.push(this.newNodes[key]);
    });
    Object.keys(this.newLinks).forEach(key => {
      this.linksArray.push(this.newLinks[key]);
    });
    this.stateService.twiglet.saveChanges(this.userState.currentTwigletId, this.userState.currentTwigletRev,
      this.userState.currentTwigletName, this.userState.currentTwigletDescription, this.form.value.commit,
      this.nodesArray, this.linksArray).subscribe(response => {
        this.stateService.twiglet.loadTwiglet(this.userState.currentTwigletId);
        this.stateService.userState.setEditing(false);
        this.activeModal.close();
      },
      error => {
        this.errorMessage = 'Something went wrong saving your changes.';
        console.error(error);
      });
  }

}
