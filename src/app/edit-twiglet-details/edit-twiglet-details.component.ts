import { StateService } from './../state.service';
import { Subscription } from 'rxjs';
import { Map } from 'immutable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-twiglet-details',
  styleUrls: ['./edit-twiglet-details.component.scss'],
  templateUrl: './edit-twiglet-details.component.html',
})
export class EditTwigletDetailsComponent implements OnInit, AfterViewChecked {

  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'Name already taken.'
    },
  };
  originalTwigletName: string;
  twigletNames: string[] = [];
  twiglet: Map<string, any> = Map({});
  backendServiceSubscription: Subscription;
  twigletSubscription: Subscription;
  userState: Map<string, any> = Map({});

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private cd: ChangeDetectorRef) {
    this.stateService.userState.observable.subscribe(userState => {
      userStateServiceResponseToObject.bind(this)(userState);
    });
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      commitMessage: ['', [Validators.required]],
      description: '',
      name: ['', [Validators.required, this.validateName.bind(this)]],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.backendServiceSubscription = this.stateService.backendService.observable.subscribe(response => {
      this.twigletNames = response.get('twiglets').reduce((array, twiglet) => {
        array.push(twiglet.name);
        return array;
      }, []);
    });
    this.twigletSubscription = this.stateService.twiglet.observable.subscribe(twiglet => {
      if (!this.originalTwigletName) {
        this.originalTwigletName = twiglet.get('name');
      }
      this.twiglet = twiglet;
      this.form.patchValue({
        description: this.twiglet.get('description'),
        name: this.twiglet.get('name'),
      });
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  updateName() {
    this.stateService.twiglet.setName(this.form.value.name);
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
        const messages = this.validationMessages[key];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.formErrors[key] += messages[error] + ' ';
        });
      }
    });
  }

  validateName(c: FormControl) {
    return !this.twigletNames.includes(c.value) || c.value === this.originalTwigletName ? null : {
      unique: {
        valid: false,
      }
    };
  }

}
