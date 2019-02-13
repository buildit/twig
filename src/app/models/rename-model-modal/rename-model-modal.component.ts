import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges,
  OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { handleError } from '../../../non-angular/services-helpers';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-rename-model-modal',
  styleUrls: ['./rename-model-modal.component.scss'],
  templateUrl: './rename-model-modal.component.html',
})
export class RenameModelModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  modelName: string;
  /**
   * The list of invalid names
   *
   * @type {string[]}
   * @memberOf RenameModelModalComponent
   */
  modelNames: string[] = [];
  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      slash: '/, ? characters are not allowed.',
      trimTest: 'Name must be more than spaces',
      unique: 'Name already taken.',
    },
  };

  constructor(private fb: FormBuilder, private stateService: StateService, private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal, public router: Router, public toastr: ToastrService) {
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: [this.modelName, [Validators.required, this.validateUniqueName.bind(this), this.validateSlash.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  setupModelLists(models: List<Object>) {
    this.modelNames = models.toJS().map(model => model.name);
  }

  processForm() {
    if (this.form.controls['name'].dirty) {
      this.stateService.model.setName(this.form.value.name);
      const commitMessage = `"${this.modelName}" renamed to "${this.form.value.name}"`;
      this.stateService.model.saveChanges(commitMessage)
      .subscribe(response => {
        this.stateService.model.updateListOfModels();
        this.router.navigate(['model', this.form.value.name]);
        this.activeModal.close();
      }, handleError.bind(this));
    } else {
      this.toastr.warning('Nothing changed', null);
    }
  }

  onValueChanged() {
    if (!this.form) { return; }
    const form = this.form;
    Reflect.ownKeys(this.formErrors).forEach((key: string) => {
      this.formErrors[key] = '';
      const control = form.get(key);
      if (control && control.dirty && !control.valid) {
        this.stateService.userState.setFormValid(false);
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.formErrors[key] = messages[error] + ' ';
        });
      }
    });
  }

  validateUniqueName(c: FormControl) {
    return !this.modelNames.includes(c.value) || c.value === this.modelName ? null : {
      unique: {
        valid: false,
      }
    };
  }

  validateSlash(c: FormControl) {
    if ((c.value && c.value.includes('/')) || (c.value && c.value.includes('?'))) {
      return {
        slash: {
          valid: false
        }
      };
    }
  }
}
