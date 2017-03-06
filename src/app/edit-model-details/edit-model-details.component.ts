import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelsService } from './../../non-angular/services-helpers/models/index';
import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { StateService } from './../state.service';
import { Subscription } from 'rxjs';
import { handleError } from '../../non-angular/services-helpers/httpHelpers';
import { Map, List } from 'immutable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-model-details',
  styleUrls: ['./edit-model-details.component.scss'],
  templateUrl: './edit-model-details.component.html',
})
export class EditModelDetailsComponent implements OnInit, AfterViewChecked {
  currentModelOpenedName: string;
  /**
   * The initial twiglet name that is being edited.
   *
   * @type {string}
   * @memberOf EditTwigletDetailsComponent
   */
  modelName: string;
  /**
   * The list of invalid names
   *
   * @type {string[]}
   * @memberOf EditTwigletDetailsComponent
   */
  modelNames: string[] = [];
  /**
   * The twiglet service that holds the twiglet being renamed.
   *
   * @type {ModelsService}
   * @memberOf EditTwigletDetailsComponent
   */
  modelService: ModelsService;

  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      trimTest: 'Name must be more than spaces',
      unique: 'Name already taken.',
    },
  };

  constructor(private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private router: Router,
    private toastr: ToastsManager) {
      this.modelService = new ModelsService(
        stateService.http,
        stateService.toastr,
        stateService.router,
        stateService.modalService,
        false,
        stateService.userState);
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateUniqueName.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.modelService.loadModel(this.modelName);
    const sub = this.modelService.observable.subscribe(model => {
      if (model && model.get('name')) {
        this.form.patchValue({
          description: model.get('description'),
          name: model.get('name'),
        });
        sub.unsubscribe();
      }
    });
  }

  setupModelLists(models: List<Object>) {
    this.modelNames = models.toJS().map(model => model.name);
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  processForm() {
    if (this.form.controls['name'].dirty || this.form.controls['description'].dirty) {
      this.modelService.setName(this.form.value.name);
      const commitMessage = [];
      if (this.form.controls['name'].dirty) {
        commitMessage.push(`"${this.modelName}" renamed to "${this.form.value.name}"`);
      }
      this.modelService.saveChanges(commitMessage.join(' and '))
      .subscribe(response => {
        this.stateService.model.updateListOfModels();
        if (this.currentModelOpenedName === this.modelName) {
          if (this.form.value.name !== this.modelName) {
            this.router.navigate(['model', this.form.value.name]);
          } else {
            this.stateService.twiglet.changeLogService.refreshChangelog();
          }
        }
        this.activeModal.close();
      }, handleError);
    } else {
      this.toastr.warning('Nothing changed');
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
}
