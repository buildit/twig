import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-gravity-point-toggle',
  styleUrls: ['./add-gravity-point-toggle.component.scss'],
  templateUrl: './add-gravity-point-toggle.component.html',
})
export class AddGravityPointToggleComponent implements OnInit {
  @Input() userState;

  constructor() { }

  ngOnInit() {
  }

}
