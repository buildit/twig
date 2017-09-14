import { AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { GravityPoint } from './../../../non-angular/interfaces/userState/index';
import { StateService } from './../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-gravity-point-modal',
  styleUrls: ['./edit-gravity-point-modal.component.scss'],
  templateUrl: './edit-gravity-point-modal.component.html',
})
export class EditGravityPointModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  gravityPoint: GravityPoint;
  userStateSubscription: Subscription;
  gravityPointNames: Array<any> = [];
  gravityPoints: Object;
  form: FormGroup;
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'Name already taken.',
    },
  };
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private stateService: StateService, public toastr: ToastsManager, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
    this.userStateSubscription = this.stateService.userState.observable.subscribe(userState => {
      this.gravityPoints = userState.get(this.USERSTATE.GRAVITY_POINTS).toJS();
      for (const key of Reflect.ownKeys(this.gravityPoints)) {
        this.gravityPointNames.push(this.gravityPoints[key].name);
      }
    });
    if (this.gravityPoint.name.length) {
      this.form.patchValue({
        name: this.gravityPoint.name,
      });
    }
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateUniqueName.bind(this)]],
    });
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
      return true;
    }
    return false;
  }

  onValueChanged() {
    if (!this.form) { return false; }
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
    return true;
  }

  processForm() {
    if (this.form.controls['name'].dirty) {
      this.gravityPoint.name = this.form.value.name;
      this.stateService.userState.setGravityPoint(this.gravityPoint);
      this.closeModal();
    } else {
      this.toastr.warning('Nothing changed', null);
    }
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  deleteGravityPoint() {
    if (this.gravityPoint.name) {
      delete this.gravityPoints[this.gravityPoint.id];
      this.stateService.userState.setGravityPoints(this.gravityPoints);
      this.closeModal();
    } else {
      this.closeModal();
    }
  }

  validateUniqueName(c: FormControl) {
    if (this.gravityPointNames) {
      if (this.gravityPointNames.includes(c.value)) {
        return {
          unique: {
            valid: false,
          }
        };
      }
    }
  }

}
