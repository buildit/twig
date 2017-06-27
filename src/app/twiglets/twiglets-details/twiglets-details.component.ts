import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglets-details',
  styleUrls: ['./twiglets-details.component.scss'],
  templateUrl: './twiglets-details.component.html'
})
export class TwigletsDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
