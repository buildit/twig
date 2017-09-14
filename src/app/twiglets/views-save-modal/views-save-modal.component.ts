import { AfterViewChecked, Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-views-save-modal',
  styleUrls: ['./views-save-modal.component.scss'],
  templateUrl: './views-save-modal.component.html',
})
export class ViewsSaveModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  // This modal is used to either create a new view or update an existing view. It defaults to blank name, description, etc
  // but receives initial input if a view is getting updated.
  viewUrl: string;
  name = '';
  description = '';
  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      slash: '/, ? characters are not allowed.',
      unique: 'Name already taken.'
    },
  };
  twigletName;
  views;
  viewNames;

  constructor(private fb: FormBuilder, private stateService: StateService, public activeModal: NgbActiveModal,
    public router: Router, public toastr: ToastsManager) {
  }

  setup(viewUrl?, name?, description?) {
    this.viewUrl = viewUrl;
    this.name = name;
    this.description = description;
  }

  ngOnInit() {
    this.viewNames = this.views.toJS().map(view => view.name);
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      description: [this.description || ''],
      name: [this.name, [Validators.required, this.validateUniqueName.bind(this), this.validateSlash.bind(this)]],
    });
  }

  onValueChanged() {
    if (!this.form) { return; }
    const form = this.form;
    Reflect.ownKeys(this.formErrors).forEach((key: string) => {
      this.formErrors[key] = '';
      const control = form.get(key);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.formErrors[key] = messages[error] + ' ';
        });
      }
    });
  }

  validateUniqueName(c: FormControl) {
    return !this.viewNames.includes(c.value) || c.value === this.name ? null : {
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

  processForm() {
    if (this.form.controls['name'].dirty || this.form.controls['description'].dirty) {
      this.stateService.userState.startSpinner();
      if (this.viewUrl) {
        this.stateService.twiglet.viewService.saveView(this.viewUrl, this.form.value.name, this.form.value.description)
        .subscribe(response => {
          this.afterSave();
        });
      } else {
        this.stateService.twiglet.viewService.createView(this.form.value.name, this.form.value.description)
        .subscribe(response => {
          this.afterSave();
        });
      }
    } else {
      this.toastr.warning('Nothing changed', null);
    }
  }

  afterSave() {
    this.stateService.userState.stopSpinner();
    this.activeModal.close();
    this.stateService.userState.setCurrentView(this.form.value.name);
    this.router.navigate(['twiglet', this.twigletName, 'view', this.form.value.name]);
  }

}
