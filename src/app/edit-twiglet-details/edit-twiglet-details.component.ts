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
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-details',
  styleUrls: ['./edit-twiglet-details.component.scss'],
  templateUrl: './edit-twiglet-details.component.html',
})
export class EditTwigletDetailsComponent implements OnInit, AfterViewChecked {
  @Input() twiglets: List<Map<string, any>>;
  @Input() twiglet: Map<string, any>;
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
  originalTwigletName: string;
  twigletNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef) {
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      commitMessage: ['', [Validators.required]],
      description: '',
      name: ['', [Validators.required, this.validateUniqueName.bind(this), this.validateMoreThanSpaces]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.stateService.userState.setFormValid(true);
    this.twigletNames = this.twiglets.reduce((array, twiglet) => {
      array.push(twiglet.get('name'));
      return array;
    }, []);
    this.originalTwigletName = this.twiglet.get('name');
    this.form.patchValue({
      description: this.twiglet.get('description'),
      name: this.twiglet.get('name'),
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  updateName() {
    this.stateService.twiglet.setName(this.form.value.name);
    if (!this.formErrors.name) {
      this.stateService.userState.setFormValid(true);
    }
  }

  updateDescription() {
    this.stateService.twiglet.setDescription(this.form.value.description);
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
          this.formErrors[key] += messages[error] + ' ';
        });
      }
    });
  }

  validateUniqueName(c: FormControl) {
    return !this.twigletNames.includes(c.value) || c.value === this.originalTwigletName ? null : {
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
