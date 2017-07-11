import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simulation-controls',
  styleUrls: ['./simulation-controls.component.scss'],
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent implements OnInit {
  @Input() userState;

  constructor() { }

  ngOnInit() {
  }

}
