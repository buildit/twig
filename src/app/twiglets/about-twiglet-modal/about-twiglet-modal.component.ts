import { ChangeDetectionStrategy, Component, Input, OnInit, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about-twiglet-modal',
  styleUrls: ['./about-twiglet-modal.component.scss'],
  templateUrl: './about-twiglet-modal.component.html',
})
export class AboutTwigletModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  twigletName: string;
  description: string;
  currentTwiglet: string;
  userState: Map<string, any>;
  editMode = false;
  form: FormGroup;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(private fb: FormBuilder, public stateService: StateService, public activeModal: NgbActiveModal, private router: Router) {}

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewChecked() {
    if (this.elementRef) {
      this.elementRef.nativeElement.focus();
    }
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: this.description,
    });
  }

  processForm() {
    // save the description to the current twiglet, then save the changes to the twiglet
    this.stateService.twiglet.setDescription(this.form.controls.description.value);
    this.stateService.twiglet.saveChanges('description updated')
      .subscribe(response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.stateService.twiglet.changeLogService.refreshChangelog();
        this.activeModal.close();
      }, handleError);
  }

  editableAbout() {
    return !this.editMode && this.userState.get(this.USERSTATE.USER) && this.currentTwiglet === this.twigletName;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      if (this.editableAbout()) {
        this.editMode = true;
      } else if (!this.editMode) {
        this.activeModal.close();
      }
    }
  }

}
