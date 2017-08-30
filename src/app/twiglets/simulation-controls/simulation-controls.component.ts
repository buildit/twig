import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simulation-controls',
  styleUrls: ['./simulation-controls.component.scss'],
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  @Input() userState;

  constructor() { }

}
