import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-help',
  styleUrls: ['./help.component.scss'],
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
