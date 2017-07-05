import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { handleError } from '../../../non-angular/services-helpers';
import { ModelChangelog } from './../../../non-angular/interfaces/model/index';
import { StateService } from './../../state.service';

@Component({
  selector: 'app-header-model',
  styleUrls: ['./header-model.component.scss'],
  templateUrl: './header-model.component.html',
})
export class HeaderModelComponent implements OnInit {
  @Input() models;
  @Input() model;
  @Input() userState;

  constructor() {
  }

  ngOnInit() {
  }

}
