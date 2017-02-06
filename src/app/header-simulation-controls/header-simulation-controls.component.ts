import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-simulation-controls',
  styleUrls: ['./header-simulation-controls.component.scss'],
  templateUrl: './header-simulation-controls.component.html',
})
export class HeaderSimulationControlsComponent implements OnInit {
  @Input() userState;

  constructor() { }

  ngOnInit() {
  }

}
