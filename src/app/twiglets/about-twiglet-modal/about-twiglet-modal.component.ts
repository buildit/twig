import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { StateService } from './../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';
import { TwigletService } from './../../../non-angular/services-helpers/twiglet/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about-twiglet-modal',
  styleUrls: ['./about-twiglet-modal.component.scss'],
  templateUrl: './about-twiglet-modal.component.html',
})
export class AboutTwigletModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  twigletName: string;
  description: string;
  editMode = false;
  twigletService: TwigletService;
  twigletServiceSubsciption: Subscription;
  form: FormGroup;

  constructor(private fb: FormBuilder, private stateService: StateService, private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal, private toastr: ToastsManager) {
      this.twigletService = new TwigletService(
        stateService.http,
        stateService.toastr,
        stateService.router,
        stateService.modalService,
        false,
        stateService.userState, null);
    }

  ngOnInit() {
    this.buildForm();
    this.stateService.twiglet.loadTwiglet(this.twigletName).subscribe(() => undefined);
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: this.description,
    });
  }

  processForm() {
    console.log(this.form.controls.description.value);
    this.stateService.twiglet.setDescription(this.form.controls.description.value);
    this.stateService.twiglet.saveChanges('description updated')
      .subscribe(response => {
        this.stateService.twiglet.updateListOfTwiglets();
        this.stateService.twiglet.changeLogService.refreshChangelog();
        this.activeModal.close();
      }, handleError);
  }

  ngOnDestroy() {
  }

  ngAfterViewChecked() {
  }

}
