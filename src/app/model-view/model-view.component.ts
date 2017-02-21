import { Component, OnInit } from '@angular/core';
import { Map } from 'immutable';

import { StateService } from './../state.service';

@Component({
  selector: 'app-model-view',
  styleUrls: ['./model-view.component.scss'],
  templateUrl: './model-view.component.html',
})
export class ModelViewComponent implements OnInit {
  private userState: Map<string, any>;

  constructor(private stateService: StateService) {
    this.stateService.userState.observable.subscribe(userState => this.userState = userState);
  }

  ngOnInit() { 
    this.stateService.userState.setActiveModel(true);
    this.stateService.userState.setActiveTwiglet(false);
  }

}
