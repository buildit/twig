import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { handleError } from '../../../non-angular/services-helpers';
import { ModelsService } from './../../../non-angular/services-helpers/models/index';
import { StateService } from './../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-model-details',
  styleUrls: ['./edit-model-details.component.scss'],
  templateUrl: './edit-model-details.component.html',
})
export class EditModelDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
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

  modelServiceSub: Subscription;

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
    public activeModal: NgbActiveModal,
    public router: Router,
    public toastr: ToastsManager) {
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
    this.stateService.model.loadModel(this.modelName);
    this.modelServiceSub = this.stateService.model.observable.subscribe(model => {
      if (model && model.get('name')) {
        this.form.patchValue({
          description: model.get('description'),
          name: model.get('name'),
        });
        if (this.modelServiceSub) {
          this.modelServiceSub.unsubscribe();
        }
      }
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  ngOnDestroy() {
    this.modelServiceSub.unsubscribe();
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
