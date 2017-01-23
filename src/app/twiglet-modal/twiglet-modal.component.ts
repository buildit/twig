import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';

import { StateService } from '../state.service';

@Component({
  selector: 'app-twiglet-modal',
  styleUrls: ['./twiglet-modal.component.scss'],
  templateUrl: './twiglet-modal.component.html',
})
export class TwigletModalComponent implements OnInit {
  private apiUrl: string = 'http://localhost:3000';
  form: FormGroup;
  formErrors = {
    name: ''
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      unique: 'A Twiglet with this name already exists! Please rename this Twiglet.'
    }
  };
  twiglets: any[];
  models: any[];

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private stateService: StateService) { }

  ngOnInit() {
    this.buildForm();
    this.stateService.backendService.observable.subscribe(response => {
      this.twiglets = response.get('twiglets').toJS();
    });
    this.stateService.backendService.observable.subscribe(response => {
      this.models = response.get('models').toJS();
      this.form.patchValue({
        model: this.models[0]._id,
      });
    });
  }

  buildForm() {
    this.form = this.fb.group({
      cloneTwiglet: 'None',
      description: '',
      googlesheet: '',
      model: '',
      name: '',
    });
  }

  processForm() {
    if (this.form.valid) {
      this.form.value.commitMessage = 'Twiglet created.';
      this.form.value._id = 'twig-' + UUID.UUID();
      this.stateService.twiglet.addTwiglet(this.form.value).subscribe(data => {
        this.activeModal.close();
      });
    }
  }

}
