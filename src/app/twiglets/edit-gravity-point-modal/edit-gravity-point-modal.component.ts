import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { GravityPoint } from './../../../non-angular/interfaces/userState/index';
import { StateService } from './../../state.service';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-gravity-point-modal',
  styleUrls: ['./edit-gravity-point-modal.component.scss'],
  templateUrl: './edit-gravity-point-modal.component.html',
})
export class EditGravityPointModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('autofocus') private elementRef: ElementRef;
  gravityPoint: GravityPoint;
  viewDataSubscription: Subscription;
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
  VIEW = VIEW_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;


  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private stateService: StateService, public toastr: ToastsManager, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
    this.elementRef.nativeElement.focus();
    this.viewDataSubscription = this.stateService.twiglet.viewService.observable.subscribe(viewData => {
      this.gravityPoints = viewData.getIn([this.VIEW.DATA, this.VIEW_DATA.GRAVITY_POINTS]).toJS();
      this.gravityPointNames = Reflect.ownKeys(this.gravityPoints)
      .filter(id => id !== this.gravityPoint.id)
      .map(id => this.gravityPoints[id].name);
    });
    if (this.gravityPoint.name.length) {
      this.form.patchValue({
        name: this.gravityPoint.name,
      });
    }
  }

  ngOnDestroy() {
    this.viewDataSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
      return true;
    }
    return false;
  }

  buildForm() {
    const self = this;
    this.form = this.fb.group({
      name: ['', [Validators.required, this.validateUniqueName.bind(this)]],
    });
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
      this.stateService.twiglet.viewService.setGravityPoint(this.gravityPoint);
      this.closeModal();
    } else {
      let errors = false;
      const form = this.form;
      Reflect.ownKeys(this.formErrors).forEach((key: string) => {
        this.formErrors[key] = '';
        const control = form.get(key);
        if (control && !control.valid) {
          errors = true;
          const messages = this.validationMessages[key];
          Reflect.ownKeys(control.errors).forEach(error => {
            this.formErrors[key] = messages[error] + ' ';
          });
        }
      });
      if (!errors) {
        this.toastr.warning('nothing changed');
      }
      return true;
    }
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  deleteGravityPoint() {
    delete this.gravityPoints[this.gravityPoint.id];
    this.stateService.twiglet.viewService.setGravityPoints(this.gravityPoints);
    this.closeModal();
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
