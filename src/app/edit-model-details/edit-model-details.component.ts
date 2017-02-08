import { Twiglet } from './../../non-angular/interfaces/twiglet/twiglet';
import { StateService } from './../state.service';
import { Subscription } from 'rxjs';
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
  @Input() models: List<Map<string, any>>;
  @Input() model: Map<string, any>;
  @Input() userState: Map<string, any>;
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
  originalModelName: string;
  modelNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef) {
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateUniqueName.bind(this), this.validateMoreThanSpaces]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.stateService.userState.setFormValid(true);
    this.modelNames = this.models.reduce((array, twiglet) => {
      array.push(twiglet.get('name'));
      return array;
    }, []);
    this.originalModelName = this.model.get('name');
    this.form.patchValue({
      name: this.model.get('name'),
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  updateName() {
    this.stateService.model.setName(this.form.value.name);
    if (!this.formErrors.name) {
      this.stateService.userState.setFormValid(true);
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
    return !this.modelNames.includes(c.value) || c.value === this.originalModelName ? null : {
      unique: {
        valid: false,
      }
    };
  }

  validateMoreThanSpaces(c: FormControl) {
    return (c.value === undefined || c.value === null || c.value.trim()) ? null : {
      trimTest: {
        valid: false,
      }
    };
  }
}
