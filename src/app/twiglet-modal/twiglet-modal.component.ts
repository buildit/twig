import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
    // this.stateService.logIn({
    //   'email': 'ben.hernandez@corp.riglet.io',
    //   'password': 'Z3nB@rnH3n'
    // }).subscribe(data => {});
    this.stateService.getTwiglets().subscribe(response => {
      this.twiglets = response;
    });
    this.stateService.getModels().subscribe(response => {
      this.models = response;
      this.form.patchValue({
        model: this.models[0]._id,
      });
    });
    this.buildForm();
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
      this.stateService.addTwiglet(this.form.value).subscribe(data => {
        this.activeModal.close();
      });
    }
  }

}
