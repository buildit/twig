import { Component, OnInit } from '@angular/core';

import { StateService } from './../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';

@Component({
  selector: 'app-model-view',
  styleUrls: ['./model-view.component.scss'],
  templateUrl: './model-view.component.html',
})
export class ModelViewComponent implements OnInit {
  private userState: Map<string, any>;

  constructor(private stateService: StateService) {
    this.stateService.userState.observable.subscribe(userStateServiceResponseToObject.bind(this));
  }

  ngOnInit() {

  }

}
