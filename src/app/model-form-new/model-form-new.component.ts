import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Map, fromJS } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';

@Component({
  selector: 'app-model-form-new',
  styleUrls: ['./model-form-new.component.scss'],
  templateUrl: './model-form-new.component.html',
})
export class ModelFormNewComponent implements OnInit {
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;
  formErrors = {
    class: '',
    type: ''
  };
  entityFormErrors = {
    class: '',
    type: ''
  };
  validationMessages = {
    class: {
      required: 'You must choose an icon for your entity!'
    },
    type: {
      required: 'You must name your entity!'
    }
  };

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
  public fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      blankEntity: this.fb.group({
        class: ['', Validators.required],
        color: '#000000',
        image: '',
        size: '',
        type: ['', Validators.required]
      }),
      entities: this.fb.array([]),
      name: ''
    });
  }

}
