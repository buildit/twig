import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about-twiglet-modal',
  styleUrls: ['./about-twiglet-modal.component.scss'],
  templateUrl: './about-twiglet-modal.component.html',
})
export class AboutTwigletModalComponent implements OnInit {
  twigletName: string;
  description: string;
  currentTwiglet: string;
  userState;
  editMode = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, public stateService: StateService, public activeModal: NgbActiveModal, private router: Router) {}

  ngOnInit() {
    this.buildForm();
    // sets the current twiglet to the selected twiglet - this is necessary to save changes to the right twiglet
    if (this.currentTwiglet !== this.twigletName) {
      this.router.navigate(['/twiglet', this.twigletName]);
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

}
