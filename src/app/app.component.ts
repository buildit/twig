import { Component } from '@angular/core';
import { Map } from 'immutable';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private state: StateService) {
  }
}
