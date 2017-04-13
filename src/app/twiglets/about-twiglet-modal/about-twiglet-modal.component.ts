import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
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
  editMode = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, public stateService: StateService,
    public activeModal: NgbActiveModal) {
    }

  ngOnInit() {
    this.buildForm();
    // sets the current twiglet to the selected twiglet - this is necessary to save changes to the right twiglet
    this.stateService.twiglet.loadTwiglet(this.twigletName).subscribe(() => undefined);
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: this.description,
    });
  }

  processForm() {
    this.stateService.twiglet.setDescription(this.form.controls.description.value);
    this.stateService.twiglet.saveChanges('description updated')
      .subscribe(response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.stateService.twiglet.changeLogService.refreshChangelog();
        this.activeModal.close();
      }, handleError);
  }

}
